import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryV5,
  InstrumentInfoResponseV5,
  InstrumentStatusV5,
  LinearInverseInstrumentInfoV5,
} from 'bybit-api';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ContractType } from '../../constants';
import { BybitApiInstrumentInfoException } from '../../exceptions';
import { BybitPairingEntity } from './bybit-pairing.entity';
import { SavePairingCommand } from './commands/save-pairing.command';
import { CreatePairingDto } from './dtos/create-pairing.dto';
import { RetrievePairingDto } from './dtos/retrieve-pairing.dto';
import { TriggerPairingUpdateDto } from './dtos/trigger-pairing-update.dto';
import { MarketInstrumentInfoFunction } from './function/market-instrument-info.function';

@Injectable()
export class BybitPairingService {
  logger = new Logger('BybitPairingService');

  constructor(
    private commandBus: CommandBus,
    @InjectRepository(BybitPairingEntity)
    private readonly pairingRepository: Repository<BybitPairingEntity>,
  ) {}

  async updatePairing(
    updatePairingDto: TriggerPairingUpdateDto,
  ): Promise<{ updated: number; deleted: number }> {
    let updatedCount = 0;
    const allPairingData = await this.pullData(
      updatePairingDto.category,
      updatePairingDto.status ?? 'Trading',
    );
    const pulledContractTypes = new Set(
      allPairingData.map((pairing) => pairing.contractType),
    );

    const allPairingSymbols = new Set(
      allPairingData.map(
        (pairing) => `${pairing.symbol}-${pairing.contractType}`,
      ),
    );
    // Get all existing pairings where contract type matches the pulled data
    const existingPairings = await this.pairingRepository.find({
      where: [...pulledContractTypes].map((contractType) => ({ contractType })),
    });
    // Remove any existing pairings that are not in the pulled data
    const idsToRemove = existingPairings
      .filter(
        (item) => !allPairingSymbols.has(`${item.symbol}-${item.contractType}`),
      )
      .map((item) => item.id);

    if (idsToRemove.length > 0) {
      await this.pairingRepository
        .createQueryBuilder()
        .delete()
        .where('id IN (:...ids)', { ids: idsToRemove })
        .execute();
    }

    // proceed to update and save pairing if needed
    await Promise.all(
      allPairingData.map(async (pairing) => {
        const isExist = await this.pairingRepository.findOne({
          where: {
            symbol: pairing.symbol,
            contractType: pairing.contractType,
          },
        });

        if (isExist) {
          return;
        }

        updatedCount++;

        return this.savePairing(
          plainToInstance(CreatePairingDto, {
            ...pairing,
            isActive: true,
            priority: 1,
          }),
        );
      }),
    );

    return { updated: updatedCount, deleted: idsToRemove.length };
  }

  async savePairing(pairing: CreatePairingDto): Promise<BybitPairingEntity> {
    return this.commandBus.execute<SavePairingCommand, BybitPairingEntity>(
      new SavePairingCommand(pairing),
    );
  }

  // Pull bybit pairing data from Bybit API
  async pullData(
    category: CategoryV5,
    status: InstrumentStatusV5,
    cursor?: string,
  ): Promise<LinearInverseInstrumentInfoV5[]> {
    try {
      const api = new MarketInstrumentInfoFunction();
      const data: InstrumentInfoResponseV5<CategoryV5> =
        await api.getMarketInstrumentInfo(category, status, cursor ?? '');

      const nextCursor = data.nextPageCursor;

      if (nextCursor) {
        const nextPageData = await this.pullData(category, status, nextCursor);

        return [
          ...data.list,
          ...nextPageData,
        ] as LinearInverseInstrumentInfoV5[];
      }

      return data.list as LinearInverseInstrumentInfoV5[];
    } catch {
      throw new BybitApiInstrumentInfoException();
    }
  }

  // Get bybit pairings by contract type
  async getPairingByContractType(
    contractTypes?: ContractType[],
    quoteCoin?: string,
  ): Promise<RetrievePairingDto[]> {
    const entity = await this.pairingRepository.find({
      where: contractTypes?.map((type) => ({
        contractType: type,
        quoteCoin: quoteCoin ?? 'USDT',
      })),
    });

    return plainToInstance(RetrievePairingDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
