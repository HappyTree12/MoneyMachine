import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { TELEGRAM_BTN_ACTIONS, SCENES, TELEGRAM_YES_NO_KEYBOARD } from '../../../constants';
import { GeneratorProvider } from '../../../providers';
import { validateText, validateEmail, validateUserLastName } from '../../../common/utils';
import { BOT_MESSAGES } from '../telegram.messages';
import { UserService } from '../../user/user.service';
import { UserRegisterDto } from '../../auth/dto/user-register.dto';

@Wizard(SCENES.REGISTER_USER)
export class RegisterUserScene {

  constructor(private userService: UserService) {
  }

  @WizardStep(1)
  async step1(@Context() ctx) {
    // Get initial data
    const { chatID } = ctx?.wizard?.state;
    // const user = await this.userService.findByUsernameOrEmail({
    //   telegramChatId: chatID
    // })
    // if (user !== null) {
    //   await ctx.reply(BOT_MESSAGES.ERROR.USER_REGISTERED)
    //   return ctx.scene.leave();
    // }

    // Add store 'userData' to collect entered user's data
    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatID = chatID;

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

    // Ask user enter his first name
    await ctx.reply(BOT_MESSAGES.ENTER_EMAIL);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx) {

    // Get user's entered text
    const email: string = ctx?.message?.text;
    // Email does not valid, return user to prev step
    if (!validateEmail(email)) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.EMAIL, { parse_mode: 'html' });
      } catch (error) {
        console.log('sendMessage :::', error);
      }

      return;
    }

    const formatedEmail = email.trim();
    ctx.wizard.state.userData.email = formatedEmail;
    const user = await this.userService.findByUsernameOrEmail({ email: formatedEmail })
    if (user === null) {
      // Ask user enter his first name
      await ctx.reply(BOT_MESSAGES.ENTER_FIRST_NAME);
      ctx.wizard.next();
      return
      // await ctx.reply("Register new user function under maintainance. Please ask Jia Lin to code for that")
    }
    else if (user.telegramChatId !== null) {
      await ctx.reply(BOT_MESSAGES.ERROR.EMAIL_REGISTERED)
    }
    else {
      await this.userService.setTelegramChatId(user.id, ctx.wizard.state.userData.chatID)
      await ctx.reply(BOT_MESSAGES.REGISTERED_SUCCESSFULLY)
    }
    ctx.scene.leave();
  }

  @WizardStep(4)
  async step4(@Context() ctx) {
    // Get user's entered text
    const firstName: string = ctx?.message?.text;

    // Validate user text (first name), minimum 2 letters
    const isFirstNameValid = validateText(firstName);

    // User name does not valid, return user to prev step
    if (!isFirstNameValid) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.FIRST_NAME, { parse_mode: 'html' });
      } catch (error) {
        console.log('sendMessage :::', error);
      }

      return;
    }

    const formatedUserFirstName = firstName.trim();
    // Add user's first name to the state
    ctx.wizard.state.userData.firstName = formatedUserFirstName;

    // Ask user enter his last name
    await ctx.reply(BOT_MESSAGES.ENTER_LAST_NAME);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Context() ctx) {
    // Get user's entered text (last name)
    const lastName: string = ctx?.message?.text;

    if (lastName) {
      // Validate user text (last name)
      const isLastNameValid = validateUserLastName(lastName);

      // Return user to prev step
      if (!isLastNameValid) {
        await ctx.reply(BOT_MESSAGES.ERROR.LAST_NAME, {
          parse_mode: 'html',
        });

        return;
      }

      // Add user last name to the state
      const formatedUserLastName = lastName.trim();
      ctx.wizard.state.userData.lastName = formatedUserLastName;
    }

    const otp = GeneratorProvider.generateRandomString(6)
    const userRegisterDto: UserRegisterDto = {
      firstName: ctx.wizard.state.userData.firstName,
      lastName: ctx.wizard.state.userData.lastName,
      email: ctx.wizard.state.userData.email,
      otp: otp,
      telegramChatId: ctx.wizard.state.userData.chatID
    }

    try {
      await this.userService.createUser(userRegisterDto)
      await ctx.reply(BOT_MESSAGES.REGISTERED_SUCCESSFULLY)
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        await ctx.reply(error.message);
      } else {
        await ctx.reply('Unknown error occurred');
      }

    }
    return ctx.scene.leave();
  }

  // @WizardStep(5)
  // async step5(@Context() ctx) {
  //   // Here must be user's shared phone
  //   const userPhone: string = ctx?.update?.message?.contact?.phone_number;

  //   // User did not click on btn share phone
  //   if (!userPhone) {
  //     try {
  //       await ctx.reply(BOT_MESSAGES.ERROR.USER_PHONE, { parse_mode: 'html' });
  //     } catch (error) {
  //       console.log('sendMessage :::', error);
  //     }

  //     return;
  //   }

  //   // const { userData } = ctx.wizard.state;

  //   // const user = await this.telegramService.createUser(userData);

  //   // if (!user) {
  //   //   await ctx.reply(BOT_MESSAGES.ERROR.CREATE_USER, { parse_mode: 'html' });
  //   // }

  //   ctx.scene.leave();
  // }
}
