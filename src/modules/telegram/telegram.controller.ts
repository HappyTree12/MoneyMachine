import {
  Action,
  Command,
  Ctx,
  InjectBot,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { SCENES } from '../../constants';
import { BybitMainAccService } from '../bybit-main-acc/bybit-main-acc.service';
import { BybitSubAccService } from '../bybit-sub-acc/bybit-sub-acc.service';
import { UserService } from '../user/user.service';
// import { TelegramActions } from './telegram.actions';
// import { TelegramUtils } from './telegram.utils';
import { COMMANDS } from './telegram.commands';
import { BOT_MESSAGES } from './telegram.messages';

@Update()
export class TelegramController {
  // private readonly telegramActions: TelegramActions;
  // private readonly telegramUtils: TelegramUtils;

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private userService: UserService,
    private bybitMainAccService: BybitMainAccService,
    private bybitSubAccService: BybitSubAccService,
    // private readonly telegramService: TelegramService,
  ) {
    void this.bot.telegram.setMyCommands(COMMANDS);
    // this.telegramActions = new TelegramActions(this.telegramService);
    // this.telegramUtils = new TelegramUtils();
  }

  @Start()
  async startCommand(ctx): Promise<any> {
    const userTelegramName: string =
      ctx?.update?.message?.from?.first_name ||
      ctx?.update?.message?.from?.username;

    let greeting = `${userTelegramName}${BOT_MESSAGES.NEW_USER_GREETING}\n\n`;

    for (const command of COMMANDS) {
      greeting += `${command.command} - ${command.description}\n`;
    }

    await ctx.reply(greeting);

    const startPayload = ctx.startPayload;
    console.info(
      '[DEBUG] 🚀 ~ TelegramController ~ startCommand ~ startPayload:',
      startPayload,
    );

    if (startPayload) {
      try {
        // Decode the Base64 encoded message
        const decodedMessage = Buffer.from(startPayload, 'base64').toString(
          'utf8',
        );
        console.info(
          '[DEBUG] 🚀 ~ TelegramController ~ startCommand ~ decodedMessage:',
          decodedMessage,
        );

        // Parse the decoded message
        // const [action, ...params] = decodedMessage.split(':');
      } catch (error) {
        console.error('Error processing start payload:', error);
        ctx.reply(
          'Sorry, there was an error processing your request. Please try again.',
        );
      }
    }
  }

  @Command('register')
  async registerAccount(ctx): Promise<any> {
    const chatID: number = ctx?.update?.message?.from?.id;

    if (!chatID) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    try {
      await ctx.scene.enter(SCENES.REGISTER_USER, {
        chatID,
      });
    } catch (error) {
      console.info('ERROR registerUserScene enter :::', error);
    }
  }

  @Command('my_profile')
  async myProfileCommand(ctx): Promise<any> {
    const chatID = ctx?.update?.message?.from?.id;

    if (!chatID) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user = await this.userService.findByUsernameOrEmail({
      telegramChatId: chatID,
    });

    if (user === null) {
      await ctx.reply('User not found!');

      return;
    }

    await ctx.reply('Welcome JiaLin to join redsquare');

    try {
      const bybitMainAcc =
        await this.bybitMainAccService.getBybitMainApiInfoFromDbByUserId(
          user.id,
        );
      await ctx.reply(
        `Your Main API key: ${bybitMainAcc.apiKey}\nExpired at: ${bybitMainAcc.expiredAt}`,
      );

      let full_text = 'Your Sub Account:\n';
      const bybitSubAccArray =
        await this.bybitSubAccService.getBybitSubInfoByMainAccId(
          bybitMainAcc.id,
        );

      for (const bybitSubAcc of bybitSubAccArray) {
        full_text += `API key: ${bybitSubAcc.apiKey}\nExpired at: ${bybitSubAcc.expiredAt}\n\n`;
      }

      await ctx.reply(full_text);
    } catch {}
  }

  @Command('bind_bybit')
  async bindBybitMainAccount(ctx): Promise<any> {
    const chatId = ctx?.update?.message?.from?.id;

    if (!chatId) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user = await this.userService.findByUsernameOrEmail({
      telegramChatId: chatId,
    });

    if (user === null) {
      await ctx.reply(BOT_MESSAGES.ERROR.USER_NOT_REGISTERED);

      return;
    }

    try {
      await ctx.scene.enter(SCENES.BIND_BYBIT_MAIN_ACC, {
        chatId,
        userId: user.id,
      });
    } catch (error) {
      console.info('ERROR registerUserScene enter :::', error);
    }
  }

  @Command('create_sub_acc')
  async createBybitSubAcc(ctx): Promise<any> {
    const chatId = ctx?.update?.message?.from?.id;

    if (!chatId) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user = await this.userService.findByUsernameOrEmail({
      telegramChatId: chatId,
    });

    if (user === null) {
      await ctx.reply(BOT_MESSAGES.ERROR.USER_NOT_REGISTERED);

      return;
    }

    await ctx.scene.enter(SCENES.CREATE_BYBIT_SUB_ACC, {
      chatId,
      userId: user.id,
    });
  }

  @Command('connect_phantom')
  async connectWalletCommand(@Ctx() ctx) {
    try {
      await ctx.scene.enter(SCENES.CONNECT_PHANTOM); // Enter the wallet connection scene
    } catch (error) {
      console.info('ERROR connectWalletScene enter :::', error);
    }
  }

  // Resuming the wizard after user signals they have connected
  @Command('transfer')
  async onConnected(@Ctx() ctx) {
    try {
      await ctx.scene.enter(SCENES.WALLET_TRANSFER_FUNDS); // Enter the scenes for transferring funds
    } catch (error) {
      console.info('ERROR transferWalletScene enter :::', error);
    }
  }

  // Handle btns click
  @Action(/^btn_payload_here/g)
  async handler(ctx): Promise<any> {
    try {
      console.info('Yep!', ctx);
    } catch (error) {
      console.info('[error]', error);
    }
  }

  @Command('run_bot')
  async runBot(ctx): Promise<any> {
    const chatId = ctx?.update?.message?.from?.id;

    if (!chatId) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user = await this.userService.findByUsernameOrEmail({
      telegramChatId: chatId,
    });

    if (user === null) {
      await ctx.reply(BOT_MESSAGES.ERROR.USER_NOT_REGISTERED);

      return;
    }

    await ctx.scene.enter(SCENES.RUN_BOT, {
      chatId,
      userId: user.id,
    });
  }

  // Handle btns click
  // @Action(/^btn_payload_here/g)
  // async handler(ctx): Promise<any> {
  //   try {
  //     console.log('Yep!', ctx);
  //   } catch (error) {
  //     console.log('[error]', error);
  //   }
  // }

  // // Enter dialog Scene between buyer and seller
  // @Action(/^register_user_btn_payload/g)
  // async registerUserScene(ctx): Promise<any> {
  //   try {
  //     await ctx.scene.enter(SCENES.REGISTER_USER, {
  //       // additionalParams
  //     });
  //   } catch (error) {
  //     console.log('ERROR registerUserScene enter :::', error);
  //   }
  // }
}
