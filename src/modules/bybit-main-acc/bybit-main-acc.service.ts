import { HttpException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  BybitApiNotFoundException,
  BybitApiNotValidException,
} from '../../exceptions/bybit-api.exception';
import { EncryptionService } from '../../shared/services/encryption.service';
import { BybitMainAccEntity } from './bybit-main-acc.entity';
import { CreateBybitMainAccCommand } from './commands/create-bybit-main-acc.command';
import { RefreshBybitMainAccCommand } from './commands/refresh-bybit-main-acc.command';
import { type BybitMainAccDTO } from './dtos/bybit-main-acc.dto';
import { CreateBybitMainAccDto } from './dtos/create-bybit-main-acc.dto';
import { BybitMainApiFunction } from './function/bybit-main-acc-api.function';

@Injectable()
export class BybitMainAccService {
  constructor(
    @InjectRepository(BybitMainAccEntity)
    private bybitMainAccRepository: Repository<BybitMainAccEntity>,
    private commandBus: CommandBus,
    private encryptionService: EncryptionService,
  ) {}

  @Transactional()
  async createBybitMainApi(
    createBybitMainDto: CreateBybitMainAccDto,
    userId: Uuid,
  ): Promise<BybitMainAccEntity> {
    try {
      // encrypt the apiSecret value
      createBybitMainDto = {
        ...createBybitMainDto,
        apiSecret: this.encryptionService.encrypt(createBybitMainDto.apiSecret),
      };
      const bybitHttp = new BybitMainApiFunction(createBybitMainDto);
      const bybitApiInfo = await bybitHttp.getBybitApiInfo();
      const { userID, expiredAt } = bybitApiInfo;

      return this.commandBus.execute<
        CreateBybitMainAccCommand,
        BybitMainAccEntity
      >(
        new CreateBybitMainAccCommand(
          userId,
          userID,
          expiredAt,
          createBybitMainDto,
        ),
      );
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async getBybitMainApiInfoFromDbByUserId(
    userId: Uuid,
  ): Promise<BybitMainAccEntity> {
    try {
      const queryBuilder =
        this.bybitMainAccRepository.createQueryBuilder('bybit');
      queryBuilder.where('bybit.userId = :userId', { userId });

      const bybitEntity = await queryBuilder.getOne();

      if (!bybitEntity) {
        throw new BybitApiNotFoundException();
      }

      return bybitEntity;
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async refreshBybitMainAccApiExpiredTime(
    userId: Uuid,
  ): Promise<BybitMainAccDTO> {
    try {
      const bybitMainDto = await this.getBybitMainApiInfoFromDbByUserId(userId);

      const bybitHttp = new BybitMainApiFunction(bybitMainDto);
      await bybitHttp.refreshBybitMainApi();
      const { expiredAt } = await bybitHttp.getBybitApiInfo();

      return this.commandBus.execute<
        RefreshBybitMainAccCommand,
        BybitMainAccEntity
      >(new RefreshBybitMainAccCommand(bybitMainDto.id, expiredAt));
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }
}
