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
import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
import { type BybitMasterDto } from '../bybit-main-acc/dtos/bybit-master.dto';
import { BybitMainApiFunction } from '../bybit-main-acc/function/bybit-main-acc-api.function';
import { BybitSubAccEntity } from './bybit-sub-acc.entity';
import { CreateBybitSubAccCommand } from './commands/create-bybit-sub-acc.command';
import { RefreshBybitSubAccCommand } from './commands/refresh-bybit-sub-acc.command';
import { type BybitSubAccDTO } from './dtos/bybit-sub-acc.dto';
import { CreateBybitSubAccDto } from './dtos/create-bybit-sub-acc.dto';
import {
  type RefreshBybitSubAccByMainAccIdDto,
  type RefreshBybitSubAccBySubAccIdDto,
} from './dtos/refresh-bybit-sub-acc.dto';
import { BybitSubApiFunction } from './function/bybit-sub-acc-api.function';

@Injectable()
export class BybitSubAccService {
  constructor(
    @InjectRepository(BybitMainAccEntity)
    private bybitMainAccRepository: Repository<BybitMainAccEntity>,

    @InjectRepository(BybitSubAccEntity)
    private bybitSubAccRepository: Repository<BybitSubAccEntity>,
    private commandBus: CommandBus,

    private encryptionService: EncryptionService,
  ) { }

  async getBybitSubApiInfoFromDbByUserId(
    userId: Uuid,
  ): Promise<BybitSubAccDTO[]> {
    try {
      const bybitSubAccEntity = await this.bybitSubAccRepository.find({
        relations: {
          bybitMainAcc: true,
        },
        where: {
          bybitMainAcc: {
            userId,
          },
        },
      });

      if (bybitSubAccEntity.length === 0) {
        throw new BybitApiNotFoundException('No subaccount found!');
      }

      return bybitSubAccEntity.toDtos();
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async createBybitSubApi(
    createBybitSubDto: CreateBybitSubAccDto,
  ): Promise<BybitSubAccEntity> {
    const { mainAccId, apiUsername } = createBybitSubDto;
    let bybitMainApi: BybitMainAccEntity | null;
    let isTestnet = false;

    try {
      bybitMainApi = await this.bybitMainAccRepository.findOne({
        where: { id: mainAccId },
      });

      if (bybitMainApi === null) {
        throw new BybitApiNotFoundException(
          'Unable to find main bybit api in our record!',
        );
      }
    } catch (error_) {
      const error = (error_ as Error).message;

      throw new BybitApiNotFoundException(error);
    }

    try {
      isTestnet = bybitMainApi.isTestNet;
      const bybitMainHttp = new BybitMainApiFunction(bybitMainApi);
      const subaccount = await bybitMainHttp.createBybitSubAcc(apiUsername);
      const uid = Number(subaccount.uid);
      const subaccountApi = await bybitMainHttp.createBybitSubAccApi(uid);

      // Encrypt the apiSecret value
      const encryptedApiSecret = this.encryptionService.encrypt(
        subaccountApi.secret,
      );

      const createBybitSub = {
        apiKey: subaccountApi.apiKey,
        apiSecret: encryptedApiSecret,
        isTestNet: isTestnet,
        accountName: apiUsername,
        accUid: uid,
        mainAccId,
      };

      const bybitSubHttp = new BybitSubApiFunction(createBybitSub);
      const { expiredAt } = await bybitSubHttp.getBybitApiInfo();

      return this.commandBus.execute<
        CreateBybitSubAccCommand,
        BybitSubAccEntity
      >(new CreateBybitSubAccCommand(expiredAt, createBybitSub));
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async refreshBybitSubApiExpiredTimeBySubAccId(
    refreshBybitSubAccIdDto: RefreshBybitSubAccBySubAccIdDto,
  ): Promise<BybitSubAccDTO> {
    try {
      const bybitSubAccEntity = await this.getBybitSubInfoBySubAccId(
        refreshBybitSubAccIdDto.subAccId,
      );

      return await this.refreshBybitSubApi(bybitSubAccEntity);
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async refreshBybitSubApiExpiredTimeByMainAccId(
    refreshBybitMainAccIdDto: RefreshBybitSubAccByMainAccIdDto,
  ): Promise<void> {
    try {
      const bybitSubEntities = await this.getBybitSubInfoByMainAccId(
        refreshBybitMainAccIdDto.mainAccId,
      );

      const results: Array<Promise<BybitSubAccDTO>> = [];

      for (const bybitSubAccEntity of bybitSubEntities) {
        results.push(this.refreshBybitSubApi(bybitSubAccEntity));
      }

      await Promise.all(results);
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  async refreshBybitSubApi(
    bybitSubAccEntity: BybitSubAccEntity,
  ): Promise<BybitSubAccDTO> {
    const { id, apiKey, apiSecret, isTestNet } = bybitSubAccEntity;
    const bybitSubDto: BybitMasterDto = {
      apiKey,
      apiSecret,
      isTestNet,
    };
    const bybitHttp = new BybitSubApiFunction(bybitSubDto);
    await bybitHttp.refreshBybitSubApi();
    const { expiredAt } = await bybitHttp.getBybitApiInfo();

    return this.commandBus.execute<
      RefreshBybitSubAccCommand,
      BybitSubAccEntity
    >(new RefreshBybitSubAccCommand(id, expiredAt));
  }

  async getBybitSubInfoBySubAccId(id: Uuid): Promise<BybitSubAccEntity> {
    try {
      const bybitEntity = await this.bybitSubAccRepository.findOne({
        where: {
          id,
        },
      });

      if (!bybitEntity) {
        throw new BybitApiNotFoundException('Unable to get bybit sub account');
      }

      return bybitEntity;
    } catch (error_) {
      const error = (error_ as Error).message;

      throw new BybitApiNotFoundException(error);
    }
  }

  async getBybitSubInfoByMainAccId(
    mainAccId: Uuid,
  ): Promise<BybitSubAccEntity[]> {
    try {
      return await this.bybitSubAccRepository.find({
        where: {
          mainAccId,
        },
      });
    } catch (error_) {
      const error = (error_ as Error).message;

      throw new BybitApiNotFoundException(error);
    }
  }
}
