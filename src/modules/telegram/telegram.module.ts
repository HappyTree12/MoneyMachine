import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
// import { BybitMainAccModule } from 'modules/bybit-main-acc/bybit-main-acc.module';
import { BybitMainAccService } from '../bybit-main-acc/bybit-main-acc.service';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { BybitSubAccService } from '../bybit-sub-acc/bybit-sub-acc.service';
import { PhantomEntity } from '../phantom/phantom.entity';
import { PhantomService } from '../phantom/phantom.service';
import { UserEntity } from '../user/user.entity';
// import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import {
  BindBybitMainAccScene,
  RegisterUserScene,
  WalletConnectScene,
} from './scenes';
import { CreateBybitSubAccScene } from './scenes/createBybitSubAcc.scene';
import { RunBotScene } from './scenes/runBot.scene';
import { TransferFundsScene } from './scenes/transferFunds.scene';
import { TelegramController } from './telegram.controller';
import { Martingale2Service } from '../martingale-2/martingale-2.service';
import { Martingale1Service } from '../martingale-1/martingale-1.service';
import { Martingale3Service } from '../martingale-3/martingale-3.service';
import { Martingale1Entity } from '../martingale-1/martingale-1.entity';
import { Martingale2Entity } from '../martingale-2/martingale-2.entity';
import { Martingale3Entity } from '../martingale-3/martingale-3.entity';
import { BotHubService } from '../bot-hub/bot-hub.service';
import { BybitSubAccWorkerService } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.service';
import { BybitSubAccWorkerEntity } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: process.env.TELEGRAM_BOT_TOKEN ?? '',
    }),
    TypeOrmModule.forFeature([
      BybitMainAccEntity,
      BybitSubAccEntity,
      UserEntity,
      PhantomEntity,
      Martingale1Entity,
      Martingale2Entity,
      Martingale3Entity,
      BybitSubAccWorkerEntity,
    ]),
    UserModule,
    HttpModule,
  ],
  controllers: [],
  providers: [
    TelegramController,
    RegisterUserScene,
    BindBybitMainAccScene,
    CreateBybitSubAccScene,
    TransferFundsScene,
    WalletConnectScene,
    RunBotScene,
    BybitMainAccService,
    BybitSubAccService,
    Martingale1Service,
    Martingale2Service,
    Martingale3Service,
    BotHubService,
    BybitSubAccWorkerService,
    PhantomService,
  ],
  exports: [TelegrafModule],
})
export class TelegramModule { }
