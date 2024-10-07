/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import nacl from 'tweetnacl';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  DecryptPayloadDataFailedException,
  PhantomSessionNotFoundException,
  RegisterPhantomSessionFailedException,
  SharedKeyCreationFailedException,
} from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { PhantomEntity } from './phantom.entity';

dotenv.config();

@Injectable()
export class PhantomService {
  private readonly connection: Connection;

  constructor(
    private configService: ApiConfigService,
    @InjectRepository(PhantomEntity)
    private readonly phantomRepository: Repository<PhantomEntity>,
  ) {
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  }

  @Transactional()
  async generateNewKeyForChat(chatId: number): Promise<Uint8Array> {
    const keypair = nacl.box.keyPair();
    const phantomEntity = this.phantomRepository.create({
      dappPublicKey: keypair.publicKey,
      dappSecretkey: keypair.secretKey,
      chatId,
    });

    await this.phantomRepository.save(phantomEntity);

    return keypair.publicKey;
  }

  async getConnectPhantomDeeplink(chatId: number): Promise<string> {
    const phantomEntity = await this.phantomRepository.findOne({
      where: { chatId },
    });
    let publicKey = phantomEntity?.dappPublicKey;

    if (!publicKey) {
      publicKey = await this.generateNewKeyForChat(chatId);
    }

    const base58PubKey = bs58.encode(publicKey);
    const encodedRedirectLink = encodeURIComponent(
      `${this.configService.serverUrl.url}/v1/phantom/connected?chatId=${chatId}`,
    );

    return `https://phantom.app/ul/v1/connect?app_url=${this.configService.serverUrl.url}&dapp_encryption_public_key=${base58PubKey}&redirect_link=${encodedRedirectLink}&cluster=devnet`;
  }

  // Create the shared secret using Diffie-Hellman for data payload decryption
  async createSharedSecret(phantomPublicKey: string, chatId: number) {
    try {
      const phantomEntity = await this.phantomRepository.findOneOrFail({
        where: { chatId },
      });

      const sharedSecretDapp = nacl.box.before(
        bs58.decode(phantomPublicKey),
        phantomEntity.dappSecretkey as Buffer,
      );

      phantomEntity.sharedSecret = sharedSecretDapp;
      await this.phantomRepository.save(phantomEntity);
    } catch (error) {
      throw new SharedKeyCreationFailedException((error as Error).message);
    }
  }

  // decrypt payload data
  async decryptPayloadData(data: string, nonce: string, chatId: number) {
    try {
      const phantomEntity = await this.phantomRepository.findOneOrFail({
        where: { chatId },
      });

      const decryptedData = nacl.box.open.after(
        bs58.decode(data),
        bs58.decode(nonce),
        phantomEntity.sharedSecret as Uint8Array,
      );

      if (!decryptedData) {
        throw new DecryptPayloadDataFailedException();
      }

      return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
    } catch (error) {
      throw new DecryptPayloadDataFailedException((error as Error).message);
    }
  }

  async registerPhantomSession(
    chatId: number,
    decryptedData: { public_key: string; session: string },
  ) {
    try {
      const phantomEntity = await this.phantomRepository.findOneOrFail({
        where: { chatId },
      });

      phantomEntity.sessionPublicKey = decryptedData.public_key;
      phantomEntity.session = decryptedData.session;

      await this.phantomRepository.save(phantomEntity);
    } catch (error) {
      throw new RegisterPhantomSessionFailedException((error as Error).message);
    }
  }

  async getPhantomSessionByChatId(
    chatId: number,
  ): Promise<PhantomEntity | null> {
    try {
      return await this.phantomRepository.findOne({
        where: { chatId },
      });
    } catch (error) {
      throw new PhantomSessionNotFoundException((error as Error).message);
    }
  }

  async createSolTransferTransaction(from: PublicKey): Promise<Transaction> {
    const minRent = await this.connection.getMinimumBalanceForRentExemption(0);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: new PublicKey(this.configService.web3config.feeWallet),
        lamports: minRent,
      }),
    );
    transaction.feePayer = from;
    const latest = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = latest.blockhash;

    return transaction;
  }

  async createTokenTransferTransaction(from: PublicKey): Promise<Transaction> {
    const mintAddress = new PublicKey(this.configService.web3config.tokenId);
    const fromAta = await getAssociatedTokenAddress(
      mintAddress,
      from,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
    const toAta = await getAssociatedTokenAddress(
      mintAddress,
      new PublicKey(this.configService.web3config.feeWallet),
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    const transferInstruction = createTransferCheckedInstruction(
      fromAta,
      mintAddress,
      toAta,
      from,
      100_000_000_000,
      9,
      [],
      TOKEN_2022_PROGRAM_ID,
    );

    const transaction = new Transaction().add(transferInstruction);
    transaction.feePayer = from;
    const latest = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = latest.blockhash;

    return transaction;
  }

  encryptPayload(payload: any, sharedSecret: Uint8Array) {
    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecret,
    );

    return [nonce, encryptedPayload];
  }

  async createTransaction(pubKey: PublicKey, type: 'sol' | 'token') {
    if (type === 'sol') {
      return this.createSolTransferTransaction(pubKey);
    }

    return this.createTokenTransferTransaction(pubKey);
  }

  async getSendAndSignPhantomDeeplink(chatId: number, type: 'sol' | 'token') {
    const entity = await this.phantomRepository.findOne({ where: { chatId } });

    if (!entity) {
      throw new PhantomSessionNotFoundException();
    }

    const transaction = await this.createTransaction(
      new PublicKey(entity.sessionPublicKey as string),
      type,
    );

    const serializeTransaction = transaction.serialize({
      requireAllSignatures: false,
    });
    const payload = {
      session: entity.session,
      transaction: bs58.encode(serializeTransaction),
    };

    const [nonce, encryptedPayload] = this.encryptPayload(
      payload,
      entity.sharedSecret as Uint8Array,
    );

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(entity.dappPublicKey as Buffer),
      nonce: bs58.encode(nonce),
      redirect_link: `${this.configService.serverUrl.url}/v1/phantom/transfered?chatId=${chatId}`,
      payload: bs58.encode(encryptedPayload),
    });

    return `https://phantom.app/ul/v1/signAndSendTransaction?${params.toString()}`;
  }
}
