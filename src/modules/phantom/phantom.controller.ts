import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { TransactionSignedEvent } from './events/transaction-signed.event';
import { PhantomService } from './phantom.service';

@Controller('phantom')
@ApiTags('phantom')
export class PhantomController {
  constructor(
    private readonly phantomService: PhantomService,
    private readonly configService: ApiConfigService,
    private readonly eventBus: EventBus,
    @InjectBot()
    private readonly bot: Telegraf,
  ) {}

  @Get('connect')
  @Redirect()
  async connectWallet(@Query('chatId') chatId: number) {
    // connectWallet() {
    // Generate a link to Phantom Wallet for connection

    const url = await this.phantomService.getConnectPhantomDeeplink(chatId);

    return { url };
  }

  @Get('connected')
  @Redirect()
  async walletConnected(
    @Query('chatId') chatId: number,
    @Query('data') encryptedData: string,
    @Query('phantom_encryption_public_key') phantomKey: string,
    @Query('nonce') nonce: string,
  ) {
    await this.phantomService.createSharedSecret(phantomKey, chatId);
    const decryptedPayload = await this.phantomService.decryptPayloadData(
      encryptedData,
      nonce,
      chatId,
    );

    await this.phantomService.registerPhantomSession(chatId, decryptedPayload);
    const telegramRedirectUrl = `https://t.me/${this.configService.telegramBotUsername}`;

    return { url: telegramRedirectUrl };
  }
  // @Query('userId') userId: string,
  // @Query('publicKey') publicKey: string,

  @Get('session')
  getSession(@Query('chatId') chatId: number) {
    return this.phantomService.getPhantomSessionByChatId(chatId);
  }

  @Get('transfer')
  @Redirect()
  async signAndSendSolTransaction(
    @Query('chatId') chatId: number,
    @Query('type') type: 'sol' | 'token',
  ) {
    const url = await this.phantomService.getSendAndSignPhantomDeeplink(
      chatId,
      type,
    );

    return { url };
  }

  @Get('transfered')
  @Redirect()
  async transactionSigned(
    @Query('chatId') chatId: number,
    @Query('data') encryptedData: string,
    @Query('nonce') nonce: string,
  ) {
    const decryptedPayload = await this.phantomService.decryptPayloadData(
      encryptedData,
      nonce,
      chatId,
    );

    await this.bot.telegram.sendMessage(
      chatId,
      'Waiting for transaction to be finalized on solana... please wait',
    );
    this.eventBus.publish(
      new TransactionSignedEvent(decryptedPayload.signature, chatId),
    );

    const telegramRedirectUrl = `https://t.me/${this.configService.telegramBotUsername}`;

    return { url: telegramRedirectUrl };
  }
}
