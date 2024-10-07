import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BybitMainAccEntity } from '../bybit-main-acc.entity';

export class RefreshBybitMainAccCommand implements ICommand {
  constructor(
    public readonly id: Uuid,
    public readonly expiredAt: string | undefined,
  ) {}
}

@CommandHandler(RefreshBybitMainAccCommand)
export class RefreshBybitMainAccHandler
  implements ICommandHandler<RefreshBybitMainAccCommand, BybitMainAccEntity>
{
  constructor(
    @InjectRepository(BybitMainAccEntity)
    private bybitMainAccRepository: Repository<BybitMainAccEntity>,
  ) {}

  async execute(command: RefreshBybitMainAccCommand) {
    const { id, expiredAt } = command;

    return this.bybitMainAccRepository.save({ id, expiredAt });
  }
}
