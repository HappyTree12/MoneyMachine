import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BybitMainAccEntity } from '../bybit-main-acc.entity';
import { type CreateBybitMainAccDto } from '../dtos/create-bybit-main-acc.dto';

export class CreateBybitMainAccCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly accUid: number,
    public readonly expiredAt: string | undefined,
    public readonly createBybitMainDto: CreateBybitMainAccDto,
  ) {}
}

@CommandHandler(CreateBybitMainAccCommand)
export class CreateBybitMainAccHandler
  implements ICommandHandler<CreateBybitMainAccCommand, BybitMainAccEntity>
{
  constructor(
    @InjectRepository(BybitMainAccEntity)
    private bybitMainAccRepository: Repository<BybitMainAccEntity>,
  ) {}

  async execute(command: CreateBybitMainAccCommand) {
    const { userId, accUid, expiredAt, createBybitMainDto } = command;
    createBybitMainDto.userId = userId;
    createBybitMainDto.expiredAt = expiredAt;
    createBybitMainDto.accUid = accUid;

    const bybitEntity = this.bybitMainAccRepository.create(createBybitMainDto);
    await this.bybitMainAccRepository.save(bybitEntity);

    return bybitEntity;
  }
}
