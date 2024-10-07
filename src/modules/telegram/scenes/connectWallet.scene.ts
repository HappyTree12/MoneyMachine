import { Context, Wizard, WizardStep } from 'nestjs-telegraf';

import { SCENES } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';

@Wizard(SCENES.CONNECT_PHANTOM)
export class WalletConnectScene {
  constructor(private configService: ApiConfigService) {}

  @WizardStep(0)
  async onStep1(@Context() ctx) {
    const chatId = ctx.message?.from.id;

    // Send Phantom wallet connect deep link to the user
    await ctx.reply(
      'Please click the link below to connect your Phantom Wallet',
    );
    await ctx.reply(
      `[Connect Phantom](${this.configService.serverUrl.url}/v1/phantom/connect?chatId=${chatId})`,
      {
        parse_mode: 'MarkdownV2',
      },
    );

    await ctx.reply(
      'Use the /transfer command to continue after you have connected your phantom wallet',
    );

    return ctx.scene.leave();
  }
}
