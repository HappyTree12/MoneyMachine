import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { BybitSubAccWorkerController } from './bybit-sub-acc-worker.controller';
import { BybitSubAccWorkerEntity } from './bybit-sub-acc-worker.entity';
import { BybitSubAccWorkerService } from './bybit-sub-acc-worker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BybitSubAccWorkerEntity, BybitSubAccEntity]),
  ],
  controllers: [BybitSubAccWorkerController],
  providers: [BybitSubAccWorkerService],
})
export class BybitSubAccWorkerModule {}
