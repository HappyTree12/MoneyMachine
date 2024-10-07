import { Context, Wizard, WizardStep } from 'nestjs-telegraf';

import { SCENES, TELEGRAM_BOT_KEYBOARD } from '../../../constants';
import { Markup } from "telegraf";
import { BOT_MESSAGES } from '../telegram.messages';
import { BybitApiNotFoundException } from '../../../exceptions';
// import { validateTextLength } from '../../../common/utils';
// import { CreateBybitSubAccDto } from '../../bybit-sub-acc/dtos/create-bybit-sub-acc.dto';
import { BybitSubAccService } from '../../bybit-sub-acc/bybit-sub-acc.service';
import { BybitSubAccDTO } from '../../bybit-sub-acc/dtos/bybit-sub-acc.dto';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { validateStringNumber } from '../../../common/utils';
import { CreateMartingale1Dto } from '../../martingale-1/dtos/create-martingale-1.dto';
import { martingale1, martingale2, martingale3 } from '../../../constants/martingale';
import { CreateMartingale2Dto } from '../../martingale-2/dtos/create-martingale-2.dto';
import { Martingale2Service } from '../../martingale-2/martingale-2.service';
import { BotHubService } from '../../bot-hub/bot-hub.service';
import { Martingale1Service } from '../../martingale-1/martingale-1.service';
import { Martingale3Service } from '../../martingale-3/martingale-3.service';
import { CreateMartingale3Dto } from '../../martingale-3/dtos/create-martingale-3.dto';

type Hideable<B> = B & { hide: boolean }
@Wizard(SCENES.RUN_BOT)
export class RunBotScene {

  constructor(
    private bybitSubAccService: BybitSubAccService,
    private martingale1Service: Martingale1Service,
    private martingale2Service: Martingale2Service,
    private martingale3Service: Martingale3Service,
    private readonly botHubService: BotHubService,
  ) { }

  @WizardStep(1)
  async step1(@Context() ctx) {
    // Get initial data
    const { chatId, userId } = ctx?.wizard?.state;
    let bybitSubAccArray: BybitSubAccDTO[]
    const markUpButton: Hideable<InlineKeyboardButton.CallbackButton>[] = []

    try {
      bybitSubAccArray = await this.bybitSubAccService.getBybitSubApiInfoFromDbByUserId(userId)
    }
    catch (error) {
      if (error instanceof BybitApiNotFoundException) {
        await ctx.reply("Your account hasn't binded with Bybit API yet")
      }
      else {
        console.log('ERROR createSubAcc scene enter :::', error);
      }
      return ctx.scene.leave();
    }

    for (const bybitSubAcc of bybitSubAccArray) {
      markUpButton.push(Markup.button.callback(bybitSubAcc.accountName, bybitSubAcc.id))
    }
    await ctx.reply(
      BOT_MESSAGES.BYBIT.SELECT_SUB_ACC,
      Markup.inlineKeyboard(markUpButton),
    );

    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatId = chatId;
    ctx.wizard.state.userData.userId = userId;
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx) {
    // Get action on clicked btn from prev step
    const selectedAction: string = ctx?.update?.callback_query?.data;
    // If user did not click on btn, return it to prev step
    if (!selectedAction) {
      ctx.reply("Failed to choose sub account!")
      return ctx.scene.leave();;
    }
    ctx.wizard.state.userData.subAccId = selectedAction;

    await ctx.reply(
      BOT_MESSAGES.BYBIT.SELECT_BOT,
      Markup.inlineKeyboard(TELEGRAM_BOT_KEYBOARD),
    );

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx) {
    // Get action on clicked btn from prev step
    const selectedAction: string = ctx?.update?.callback_query?.data;
    // If user did not click on btn, return it to prev step
    if (!selectedAction) {
      ctx.reply("Failed to choose strategy!")
      return ctx.scene.leave();
    }

    ctx.wizard.state.userData.strategy = selectedAction
    // Ask user enter his first name
    await ctx.reply(BOT_MESSAGES.BYBIT.INVEST_AMOUNT);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Context() ctx) {
    // Get action on clicked btn from prev step
    const amount_str: string = ctx?.message?.text;
    // If user did not click on btn, return it to prev step
    if (!validateStringNumber(amount_str)) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.NOT_NUMBER, { parse_mode: 'html' });
        await ctx.reply(BOT_MESSAGES.BYBIT.INVEST_AMOUNT);
      } catch (error) {
        console.log('sendMessage :::', error);
      }

      return;
    }

    const amount = Number(amount_str)
    const minCapital = amount * 0.8
    const maxCapital = amount * 1.2
    ctx.wizard.state.userData.amount = amount
    switch (ctx.wizard.state.userData.strategy) {
      case BOT_MESSAGES.MARTINGALE.MARTINGALE_1:
        const dto1: CreateMartingale1Dto = martingale1(ctx.wizard.state.userData.subAccId)
        dto1.minCapital = minCapital
        dto1.maxCapital = maxCapital
        dto1.initialCapital = amount
        const worker1 = await this.martingale1Service.createMartingale1(dto1);
        this.botHubService.runWorkerFromBotHub({
          workerId: worker1.workerId,
        });
        break;
      case BOT_MESSAGES.MARTINGALE.MARTINGALE_2:
        const dto2: CreateMartingale2Dto = martingale2(ctx.wizard.state.userData.subAccId)
        dto2.minCapital = minCapital
        dto2.maxCapital = maxCapital
        dto2.initialCapital = amount
        const worker2 = await this.martingale2Service.createMartingale2(dto2);
        this.botHubService.runWorkerFromBotHub({
          workerId: worker2.workerId,
        });
        break;
      case BOT_MESSAGES.MARTINGALE.MARTINGALE_3:
        const dto3: CreateMartingale3Dto = martingale3(ctx.wizard.state.userData.subAccId)
        dto3.minCapital = minCapital
        dto3.maxCapital = maxCapital
        dto3.initialCapital = amount
        const worker3 = await this.martingale3Service.createMartingale3(dto3);
        this.botHubService.runWorkerFromBotHub({
          workerId: worker3.workerId,
        });
        break;
      default:
        await ctx.reply("An error occured to run bot!")
        return ctx.scene.leave();
    }


    // Go to next step
    await ctx.reply("Bot run successfully!")
    return ctx.scene.leave();
  }



}
