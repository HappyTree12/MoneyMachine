import './boilerplate.polyfill';

import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AuthModule } from './modules/auth/auth.module';
import { BotHubModule } from './modules/bot-hub/bot-hub.module';
import { BybitMainAccModule } from './modules/bybit-main-acc/bybit-main-acc.module';
import { BybitPairingModule } from './modules/bybit-pairing/bybit-pairing.module';
import { BybitSubAccModule } from './modules/bybit-sub-acc/bybit-sub-acc.module';
import { BybitSubAccWorkerModule } from './modules/bybit-sub-acc-worker/bybit-sub-acc-worker.module';
import { ForgetPasswordModule } from './modules/forget-password/forget-password.module';
import { GroupOrderModule } from './modules/group-order/group-order.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { Martingale1Module } from './modules/martingale-1/martingale-1.module';
import { Martingale1ComboModule } from './modules/martingale-1-combo/martingale-1-combo.module';
import { Martingale2Module } from './modules/martingale-2/martingale-2.module';
import { Martingale2ComboModule } from './modules/martingale-2-combo/martingale-2-combo.module';
import { Martingale3Module } from './modules/martingale-3/martingale-3.module';
import { OtpModule } from './modules/otp/otp.module';
import { PhantomModule } from './modules/phantom/phantom.module';
import { PostModule } from './modules/post/post.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { Strategy1Module } from './modules/strategy-1/strategy-1.module';
import { Strategy2Module } from './modules/strategy-2/strategy-2.module';
import { Strategy3Module } from './modules/strategy-3/strategy-3.module';
import { Strategy5Module } from './modules/strategy-5/strategy-5.module';
import { StrategyParamsModule } from './modules/strategy-params/strategy-params.module';
// import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UserModule } from './modules/user/user.module';
import { WorkerPnlModule } from './modules/worker-pnl/worker-pnl.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    HealthCheckerModule,
    BybitMainAccModule,
    BybitSubAccModule,
    OtpModule,
    Martingale2Module,
    Martingale2ComboModule,
    BybitSubAccWorkerModule,
    GroupOrderModule,
    BybitPairingModule,
    BotHubModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    Martingale1Module,
    ForgetPasswordModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST,
          port: Number(process.env.MAILER_PORT),
          auth: {
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD,
          },
        },
        defaults: {
          from: `${process.env.MAILER_FROM_NAME || ''} ${
            process.env.MAILER_FROM_NAME
              ? '<' + process.env.MAILER_FROM_ADDRESS + '>'
              : process.env.MAILER_FROM_ADDRESS
          }`.trim(),
        },
        template: {
          dir: join(__dirname, 'shared', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    Martingale1ComboModule,
    Martingale3Module,
    Strategy1Module,
    Strategy2Module,
    Strategy3Module,
    Strategy5Module,
    StrategyParamsModule,
    WorkerPnlModule,
    TelegramModule,
    PhantomModule,
  ],
})
export class AppModule {}
