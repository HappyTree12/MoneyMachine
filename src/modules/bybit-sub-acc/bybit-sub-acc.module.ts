import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { UserEntity } from '../user/user.entity';
import { BybitSubController } from './bybit-sub-acc.controller';
import { BybitSubAccService } from './bybit-sub-acc.service';
import { CreateBybitSubHandler } from './commands/create-bybit-sub-acc.command';
import { RefreshBybitSubAccHandler } from './commands/refresh-bybit-sub-acc.command';

const handlers = [CreateBybitSubHandler, RefreshBybitSubAccHandler];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BybitMainAccEntity,
      BybitSubAccEntity,
      UserEntity,
    ]),
  ],
  controllers: [BybitSubController],
  providers: [BybitSubAccService, ...handlers],
})
export class BybitSubAccModule {}
