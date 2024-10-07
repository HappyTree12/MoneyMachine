import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TransactionSignedEvent } from './transaction-signed.event';

@EventsHandler(TransactionSignedEvent)
export class TransactionSignedHandler
  implements IEventHandler<TransactionSignedEvent>
{
  private readonly connection: Connection;

  constructor(@InjectBot() private readonly bot: Telegraf) {
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  }

  async handle(event: TransactionSignedEvent) {
    const latestBlockhash = await this.connection.getLatestBlockhash();
    await this.connection.confirmTransaction(
      {
        signature: event.signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      'finalized',
    );

    await this.bot.telegram.sendMessage(
      event.chatId,
      'Your transaction has been finalized, you can view you transaction in the link below',
    );
    await this.bot.telegram.sendMessage(
      event.chatId,
      `[Transaction Details](https://explorer.solana.com/tx/${event.signature}?cluster=devnet)`,
      { parse_mode: 'MarkdownV2' },
    );
  }
}
