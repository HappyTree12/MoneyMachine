import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkerPnlEntity } from './worker-pnl.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkerPnlEntity])],
})
export class WorkerPnlModule {}
