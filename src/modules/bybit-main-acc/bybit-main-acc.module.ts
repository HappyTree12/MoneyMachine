import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { BybitController } from './bybit-main-acc.controller';
import { BybitMainAccEntity } from './bybit-main-acc.entity';
import { BybitMainAccService } from './bybit-main-acc.service';
import { CreateBybitMainAccHandler } from './commands/create-bybit-main-acc.command';
import { RefreshBybitMainAccHandler } from './commands/refresh-bybit-main-acc.command';

const handlers = [CreateBybitMainAccHandler, RefreshBybitMainAccHandler];

@Module({
  imports: [TypeOrmModule.forFeature([BybitMainAccEntity, UserEntity])],
  controllers: [BybitController],
  providers: [BybitMainAccService, ...handlers],
})
export class BybitMainAccModule {}
