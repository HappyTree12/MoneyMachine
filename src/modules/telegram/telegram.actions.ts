// import { Markup } from 'telegraf';

import { TelegramUtils } from './telegram.utils';

// import { TELEGRAM_BTN_ACTIONS } from '../common/constants';
// import { BOT_MESSAGES } from './telegram.messages';

export class TelegramActions {
  private readonly telegramUtils: TelegramUtils;

  constructor() {
    this.telegramUtils = new TelegramUtils();
  }

  async handleUserPurchases(params) {
    const {
      userId,
      ctx
    } = params;
    this.telegramUtils.sharePhone(ctx)
    console.log('userId', userId);
  }
}
