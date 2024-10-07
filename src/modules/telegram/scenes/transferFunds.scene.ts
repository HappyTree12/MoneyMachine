/* eslint-disable dot-notation */

import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { SCENES } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';

@Wizard(SCENES.WALLET_TRANSFER_FUNDS)
export class TransferFundsScene {
  constructor(private configService: ApiConfigService) {}

  async checkTokenBalance(
    wallet: PublicKey,
    connection: Connection,
  ): Promise<bigint> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        new PublicKey(this.configService.web3config.tokenId),
        wallet,
        false,
        TOKEN_2022_PROGRAM_ID,
      );
      const accountInfo = await getAccount(
        connection,
        tokenAccount,
        'confirmed',
        TOKEN_2022_PROGRAM_ID,
      );

      return BigInt(accountInfo.amount) / BigInt(Math.pow(10, 9));
    } catch {
      return BigInt(0);
    }
  }

  @WizardStep(0)
  async onStep1(@Context() ctx) {
    const chatId = ctx.message?.from.id;
    // Retrieve the session data to confirm if the wallet is connected
    const res = await axios.get(
      `${this.configService.serverUrl.url}/v1/phantom/session?chatId=${chatId}`,
    );
    const session = res.data;

    if (!session) {
      await ctx.reply(
        'No wallet session found. Please reconnect using /connect_phantom.',
      );

      return ctx.scene.leave();
    }

    await ctx.reply(`Wallet connected: ${session.sessionPublicKey}`);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const wallet = new PublicKey(session.sessionPublicKey);
    const solBalance = await connection.getBalance(wallet);
    await ctx.reply(`Sol balance is: ${solBalance / 1_000_000_000} SOL`);

    const tokenBalance = await this.checkTokenBalance(wallet, connection);
    await ctx.reply(`MMCO balance: ${tokenBalance.toString()} MMCO`);

    // Proceed to transfer funds
    let keyboard = [
      [Markup.button.callback('Transfer SOL', 'transfer_sol')],
      [Markup.button.callback('Transfer Platform Token', 'transfer_token')],
    ];

    if (tokenBalance === BigInt(0)) {
      keyboard = keyboard.filter(
        (row) => row[0].text !== 'Transfer Platform Token',
      );
    }

    await ctx.reply(
      'Please choose a payment method:',
      Markup.inlineKeyboard(keyboard),
    );

    return ctx.wizard.next();
  }

  @WizardStep(1)
  async onStep2(@Context() ctx) {
    if (ctx.callbackQuery) {
      const action = ctx.callbackQuery.data;
      const chatId = ctx.callbackQuery?.from.id;
      await ctx.answerCbQuery();
      await ctx.reply('Please use the link below to complete transaction');
      const isSol = action === 'transfer_sol';
      await ctx.reply(
        `[Transfer Funds](${this.configService.serverUrl.url}/v1/phantom/transfer?chatId=${chatId}&type=${isSol ? 'sol' : 'token'})`,
        {
          parse_mode: 'MarkdownV2',
        },
      );

      return ctx.wizard.next();
    }

    await ctx.reply('Transfer cancelled');

    return ctx.scene.leave();
  }
}
