import { Markup } from 'telegraf';

import { BOT_MESSAGES } from '../modules/telegram/telegram.messages';

export const TELEGRAM_BTN_ACTIONS = {
  OK: 'id_0_ok',
  CANCEL: 'id_1_cancel',
  SKIP_STEP: 'id_2_skip',
};

export const SCENES = {
  REGISTER_USER: 'registerUserScene',
  BIND_BYBIT_MAIN_ACC: 'bindBybitMainAccScene',
  CREATE_BYBIT_SUB_ACC: 'createBybitSubAccScene',
  WALLET_TRANSFER_FUNDS: 'transferFundsScene',
  CONNECT_PHANTOM: 'walletConnectScene',
  RUN_BOT: 'runBotScene',
};

export const TELEGRAM_YES_NO_KEYBOARD = [
  [
    Markup.button.callback(BOT_MESSAGES.BTN_TITLE.OK, TELEGRAM_BTN_ACTIONS.OK),
    Markup.button.callback(
      BOT_MESSAGES.BTN_TITLE.CANCEL,
      TELEGRAM_BTN_ACTIONS.CANCEL,
    ),
  ],
];

export const TELEGRAM_BOT_KEYBOARD = [
  [
    Markup.button.callback(
      BOT_MESSAGES.MARTINGALE.MARTINGALE_1,
      BOT_MESSAGES.MARTINGALE.MARTINGALE_1,
    ),
    Markup.button.callback(
      BOT_MESSAGES.MARTINGALE.MARTINGALE_2,
      BOT_MESSAGES.MARTINGALE.MARTINGALE_2,
    ),
    Markup.button.callback(
      BOT_MESSAGES.MARTINGALE.MARTINGALE_3,
      BOT_MESSAGES.MARTINGALE.MARTINGALE_3,
    ),
  ],
  [
    Markup.button.callback(
      BOT_MESSAGES.STRATEGY.STRATEGY_1,
      BOT_MESSAGES.STRATEGY.STRATEGY_1,
    ),
    Markup.button.callback(
      BOT_MESSAGES.STRATEGY.STRATEGY_2,
      BOT_MESSAGES.STRATEGY.STRATEGY_2,
    ),
    Markup.button.callback(
      BOT_MESSAGES.STRATEGY.STRATEGY_3,
      BOT_MESSAGES.STRATEGY.STRATEGY_3,
    ),
  ],
  [
    Markup.button.callback(
      BOT_MESSAGES.STRATEGY.STRATEGY_4,
      BOT_MESSAGES.STRATEGY.STRATEGY_4,
    ),
    Markup.button.callback(
      BOT_MESSAGES.STRATEGY.STRATEGY_5,
      BOT_MESSAGES.STRATEGY.STRATEGY_5,
    ),
  ],
];
