import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionSignedHandler } from './events/transaction-signed.handler';
import { PhantomController } from './phantom.controller';
import { PhantomEntity } from './phantom.entity';
import { PhantomService } from './phantom.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhantomEntity]), CqrsModule],
  providers: [PhantomService, TransactionSignedHandler],
  exports: [PhantomService],
  controllers: [PhantomController],
})
export class PhantomModule {}
