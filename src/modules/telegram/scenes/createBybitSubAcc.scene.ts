import { Context, Wizard, WizardStep } from 'nestjs-telegraf';

import { SCENES } from '../../../constants';
import { BOT_MESSAGES } from '../telegram.messages';
import { BybitMainAccService } from '../../bybit-main-acc/bybit-main-acc.service';
import { BybitApiNotFoundException } from '../../../exceptions';
import { BybitMainAccEntity } from '../../bybit-main-acc/bybit-main-acc.entity';
import { validateTextLength } from '../../../common/utils';
import { CreateBybitSubAccDto } from '../../bybit-sub-acc/dtos/create-bybit-sub-acc.dto';
import { BybitSubAccService } from '../../bybit-sub-acc/bybit-sub-acc.service';


@Wizard(SCENES.CREATE_BYBIT_SUB_ACC)
export class CreateBybitSubAccScene {

  constructor(
    // @InjectRepository(UserEntity)
    // private userRepository: Repository<UserEntity>,
    private bybitMainAccService: BybitMainAccService,
    private bybitSubAccService: BybitSubAccService
  ) { }

  @WizardStep(1)
  async step1(@Context() ctx) {
    // Get initial data
    const { chatId, userId } = ctx?.wizard?.state;
    let bybitMainAcc: BybitMainAccEntity

    try {
      bybitMainAcc = await this.bybitMainAccService.getBybitMainApiInfoFromDbByUserId(userId)
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

    await ctx.reply(BOT_MESSAGES.ENTER_SUB_ACC_NAME)
    // Add store 'userData' to collect entered user's data


    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatId = chatId;
    ctx.wizard.state.userData.userId = userId;
    ctx.wizard.state.userData.bybitMainAccId = bybitMainAcc.id;
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx) {

    const apiUsername: string = ctx?.message?.text;

    // User name does not valid, return user to prev step
    if (!validateTextLength(apiUsername)) {
      await ctx.reply("Your input is empty, hence exit!")
      return ctx.scene.leave();
    }

    const createBybitSubAccDto: CreateBybitSubAccDto = {
      mainAccId: ctx.wizard.state.userData.bybitMainAccId,
      apiUsername: apiUsername
    }

    try {
      await this.bybitSubAccService.createBybitSubApi(createBybitSubAccDto)
      await ctx.reply("Created successfully!")
    }
    catch (error) {
      await ctx.reply(`An error occured while creating sub account: ${error}`)
    }
    return ctx.scene.leave();
  }

}
