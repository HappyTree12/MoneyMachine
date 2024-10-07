import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BybitSubAccEntity } from '../bybit-sub-acc.entity';
import { type BybitSubAccMasterDto } from '../dtos/bybit-sub-acc-master.dto';

export class CreateBybitSubAccCommand implements ICommand {
  constructor(
    public readonly expiredAt: string | undefined,
    public readonly bybitSubParentDto: BybitSubAccMasterDto,
  ) {}
}

@CommandHandler(CreateBybitSubAccCommand)
export class CreateBybitSubHandler
  implements ICommandHandler<CreateBybitSubAccCommand, BybitSubAccEntity>
{
  constructor(
    @InjectRepository(BybitSubAccEntity)
    private bybitSubAccRepository: Repository<BybitSubAccEntity>,
  ) {}

  async execute(command: CreateBybitSubAccCommand) {
    const { expiredAt, bybitSubParentDto } = command;
    bybitSubParentDto.expiredAt = expiredAt;

    const bybitEntity = this.bybitSubAccRepository.create(bybitSubParentDto);
    await this.bybitSubAccRepository.save(bybitEntity);

    return bybitEntity;
  }
}
