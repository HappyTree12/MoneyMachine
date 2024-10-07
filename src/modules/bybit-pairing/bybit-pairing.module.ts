import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BybitPairingController } from './bybit-pairing.controller';
import { BybitPairingEntity } from './bybit-pairing.entity';
import { BybitPairingService } from './bybit-pairing.service';
import { SavePairingHandler } from './commands/save-pairing.command';

const handlers = [SavePairingHandler];

@Module({
  imports: [TypeOrmModule.forFeature([BybitPairingEntity])],
  controllers: [BybitPairingController],
  providers: [BybitPairingService, ...handlers],
})
export class BybitPairingModule {}
