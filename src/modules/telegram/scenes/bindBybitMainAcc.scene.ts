import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { validateTextLength } from '../../../common/utils';
import { TELEGRAM_BTN_ACTIONS, SCENES, TELEGRAM_YES_NO_KEYBOARD } from '../../../constants';
import { BOT_MESSAGES } from '../telegram.messages';
import { BybitMainAccService } from '../../bybit-main-acc/bybit-main-acc.service';
import { CreateBybitMainAccDto } from '../../bybit-main-acc/dtos/create-bybit-main-acc.dto';
import { BybitApiNotFoundException, BybitApiRequestNotAcceptableException } from '../../../exceptions';


@Wizard(SCENES.BIND_BYBIT_MAIN_ACC)
export class BindBybitMainAccScene {

  constructor(
    // @InjectRepository(UserEntity)
    // private userRepository: Repository<UserEntity>,
    private bybitMainAccService: BybitMainAccService
  ) { }

  @WizardStep(1)
  async step1(@Context() ctx) {
    // Get initial data
    const { chatId, userId } = ctx?.wizard?.state;

    try {
      await this.bybitMainAccService.getBybitMainApiInfoFromDbByUserId(userId)
      await ctx.reply(BOT_MESSAGES.ERROR.BYBIT_MAIN_API_BINDED)
      return ctx.scene.leave();
    }
    catch (error) {
      if (!(error instanceof BybitApiNotFoundException)) {
        await ctx.reply(error);
        return ctx.scene.leave();
      }
    }

    // Add store 'userData' to collect entered user's data


    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatId = chatId;
    ctx.wizard.state.userData.userId = userId;

    await ctx.reply(
      BOT_MESSAGES.DATA_PROCESSING_AGREEMENT,
      Markup.inlineKeyboard(TELEGRAM_YES_NO_KEYBOARD),
    );

    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx) {
    // Get action on clicked btn from prev step
    const selectedAction: string = ctx?.update?.callback_query?.data;
    // If user did not click on btn, return it to prev step
    if (!selectedAction) {
      return;
    }

    // User clicked on Cancel btn
    if (selectedAction === TELEGRAM_BTN_ACTIONS.CANCEL) {
      await ctx.reply(BOT_MESSAGES.CANCEL_REGISTRATION);

      return ctx.scene.leave();
    }

    // Ask user enter bybit API Key
    await ctx.reply(BOT_MESSAGES.BYBIT.REQUEST_API_KEY);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx) {
    // Get user's entered text
    const bybitApiKey: string = ctx?.message?.text;

    // User name does not valid, return user to prev step
    if (!validateTextLength(bybitApiKey)) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.NOT_TEXT);
      } catch (error) {
        console.log('sendMessage :::', error);
      }

      return;
    }

    const formatedBybitApiKey = bybitApiKey.trim();
    // Add user's first name to the state
    ctx.wizard.state.userData.bybitApiKey = formatedBybitApiKey;

    // Ask user enter API secret
    await ctx.reply(BOT_MESSAGES.BYBIT.REQUEST_API_SECRET);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Context() ctx) {
    // Get user's entered text
    const bybitApiSecret: string = ctx?.message?.text;

    // User name does not valid, return user to prev step
    if (!validateTextLength(bybitApiSecret)) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.NOT_TEXT);
      } catch (error) {
        console.log('sendMessage :::', error);
      }

      return;
    }

    try {
      await ctx.telegram.deleteMessage(ctx.wizard.state.userData.chatId, ctx.message?.message_id)

      const formatedBybitApiSecret = bybitApiSecret.trim();
      // Add user's first name to the state
      // ctx.wizard.state.userData.bybitApiSecret = formatedBybitApiSecret;

      const createBybitMainAccDto: CreateBybitMainAccDto = {
        apiKey: ctx.wizard.state.userData.bybitApiKey,
        apiSecret: formatedBybitApiSecret,
        isTestNet: true,
        userId: ctx.wizard.state.userData.userId
      }

      const mainBybitApi = await this.bybitMainAccService.createBybitMainApi(
        createBybitMainAccDto, ctx.wizard.state.userData.userId)

      await ctx.reply(BOT_MESSAGES.BYBIT_MAIN_API_SUCCESSFULLY)
      await ctx.reply(`Your API expired date: ${mainBybitApi.expiredAt}`)
      // Go to next step
      return ctx.scene.leave();
    }
    catch (error) {
      if (error instanceof BybitApiRequestNotAcceptableException) {
        await ctx.reply("Your bybit API is invalid, please check your input or expired date of your API")
      }
      else {
        await ctx.reply("Unhandled error occured, please check!")
        await ctx.reply(error)
      }

    }

  }
}
