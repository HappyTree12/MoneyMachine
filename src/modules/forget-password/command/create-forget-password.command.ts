import { CommandHandler, type ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateForgetPasswordDto } from '../dtos/create-forget-password.dto';
import { ForgetPasswordEntity } from '../forget-password.entity';

export class CreateForgetPasswordCommand implements ICommand {
  constructor(
    public readonly createForgetPasswordDto: CreateForgetPasswordDto,
  ) {}
}

@CommandHandler(CreateForgetPasswordCommand)
export class CreateForgetPasswordHandler
  implements ICommandHandler<CreateForgetPasswordCommand, ForgetPasswordEntity>
{
  constructor(
    @InjectRepository(ForgetPasswordEntity)
    private forgetPasswordRepository: Repository<ForgetPasswordEntity>,
  ) {}

  execute(command: CreateForgetPasswordCommand): Promise<ForgetPasswordEntity> {
    const { createForgetPasswordDto } = command;

    const forgetPasswordEntity = this.forgetPasswordRepository.create(
      createForgetPasswordDto,
    );

    return this.forgetPasswordRepository.save(forgetPasswordEntity);
  }
}
