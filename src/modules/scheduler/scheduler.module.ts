import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BybitPairingEntity } from '../bybit-pairing/bybit-pairing.entity';
import { BybitPairingService } from '../bybit-pairing/bybit-pairing.service';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([BybitPairingEntity])],
  providers: [SchedulerService, BybitPairingService],
})
export class SchedulerModule {}
