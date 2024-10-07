import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BybitPairingEntity } from '../bybit-pairing.entity';
import { CreatePairingDto } from '../dtos/create-pairing.dto';

export class SavePairingCommand implements ICommand {
  constructor(public readonly savePairingDto: CreatePairingDto) {}
}

@CommandHandler(SavePairingCommand)
export class SavePairingHandler
  implements ICommandHandler<SavePairingCommand, BybitPairingEntity>
{
  constructor(
    @InjectRepository(BybitPairingEntity)
    private pairingRepository: Repository<BybitPairingEntity>,
  ) {}

  execute(command: SavePairingCommand) {
    const { savePairingDto } = command;
    const bybitPairingEntity = this.pairingRepository.create(savePairingDto);

    return this.pairingRepository.save(bybitPairingEntity);
  }
}
