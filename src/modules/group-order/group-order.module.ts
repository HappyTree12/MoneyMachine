import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BotHubService } from '../bot-hub/bot-hub.service';
import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { BybitSubAccWorkerEntity } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { BybitSubAccWorkerService } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.service';
import { Martingale2Service } from '../martingale-2/martingale-2.service';
import { GroupOrderEntity } from './entities/group-order.entity';
import { GroupOrderWorkersEntity } from './entities/group-order-workers.entity';
import { GroupOrderController } from './group-order.controller';
import { GroupOrderService } from './group-order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupOrderEntity,
      GroupOrderWorkersEntity,
      BybitMainAccEntity,
      BybitSubAccEntity,
      BybitSubAccWorkerEntity,
    ]),
    HttpModule,
  ],
  controllers: [GroupOrderController],
  providers: [
    GroupOrderService,
    Martingale2Service,
    BotHubService,
    BybitSubAccWorkerService,
  ],
})
export class GroupOrderModule {}
