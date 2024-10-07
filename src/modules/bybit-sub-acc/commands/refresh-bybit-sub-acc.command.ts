import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BybitSubAccEntity } from '../bybit-sub-acc.entity';

export class RefreshBybitSubAccCommand implements ICommand {
  constructor(
    public readonly id: Uuid,
    public readonly expiredAt: string | undefined,
  ) {}
}

@CommandHandler(RefreshBybitSubAccCommand)
export class RefreshBybitSubAccHandler
  implements ICommandHandler<RefreshBybitSubAccCommand, BybitSubAccEntity>
{
  constructor(
    @InjectRepository(BybitSubAccEntity)
    private bybitSubAccRepository: Repository<BybitSubAccEntity>,
  ) {}

  async execute(command: RefreshBybitSubAccCommand) {
    const { id, expiredAt } = command;

    return this.bybitSubAccRepository.save({ id, expiredAt });
  }
}
