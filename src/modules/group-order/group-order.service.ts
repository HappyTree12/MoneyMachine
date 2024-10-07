import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { StrategyType } from '../../constants/strategy-type';
import { workerRunningStatus } from '../../constants/worker-status';
import { BybitApiNotValidException } from '../../exceptions/bybit-api.exception';
import {
  WorkerIsRunningException,
  WorkerNotFoundException,
} from '../../exceptions/worker-exception';
import { BybitSubAccWorkerEntity } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { CreateMartingale2Dto } from '../martingale-2/dtos/create-martingale-2.dto';
import { Martingale2Service } from '../martingale-2/martingale-2.service';
import { CreateGroupOrderDto } from './dtos/create-group-order.dto';
import { CreateGroupOrderWorkerDto } from './dtos/create-group-order-worker.dto';
import { GroupOrderEntity } from './entities/group-order.entity';
import { GroupOrderWorkersEntity } from './entities/group-order-workers.entity';

@Injectable()
export class GroupOrderService {
  constructor(
    @InjectRepository(GroupOrderEntity)
    private groupOrderRepository: Repository<GroupOrderEntity>,

    @InjectRepository(GroupOrderWorkersEntity)
    private groupOrderWorkerRepository: Repository<GroupOrderWorkersEntity>,

    @InjectRepository(BybitSubAccWorkerEntity)
    private bybitSubAccWorkerRepository: Repository<BybitSubAccWorkerEntity>,

    private martingale2Service: Martingale2Service,
  ) {}

  @Transactional()
  async createGroupOrder(createGroupOrderDto: CreateGroupOrderDto) {
    try {
      const masterWorker = await this.bybitSubAccWorkerRepository.findOne({
        where: {
          id: createGroupOrderDto.masterWorkerId,
        },
      });

      if (masterWorker === null) {
        throw new Error('Master worker id not found!');
      }

      if (
        createGroupOrderDto.initialCapital === undefined &&
        createGroupOrderDto.minCapital === undefined &&
        createGroupOrderDto.maxCapital === undefined
      ) {
        createGroupOrderDto.initialCapital = masterWorker.initialCapital;
        createGroupOrderDto.minCapital = masterWorker.minCapital;
        createGroupOrderDto.maxCapital = masterWorker.maxCapital;
      }

      const groupOrder = this.groupOrderRepository.create(createGroupOrderDto);
      await this.groupOrderRepository.save(groupOrder);

      const runningWorkers = await this.bybitSubAccWorkerRepository.find({
        where: {
          bybitSubAccId: In(createGroupOrderDto.bybitSubAccIds),
          workerStatus: In(workerRunningStatus),
          category: masterWorker.category,
          symbol: masterWorker.symbol,
        },
      });

      if (runningWorkers.length > 0) {
        throw new WorkerIsRunningException(
          "One of the sub account's worker is running currently!",
        );
      }

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (masterWorker.strategyType) {
        case StrategyType.martingale_2: {
          return {
            groupOrderId: groupOrder.id,
            workersId: await this.createMartingale2GroupOrder(
              createGroupOrderDto,
              groupOrder.id,
            ),
          };
        }

        default: {
          throw new Error(
            `Strategy type (${masterWorker.strategyType}) not implemented!`,
          );
        }
      }
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async createMartingale2GroupOrder(
    createGroupOrderDto: CreateGroupOrderDto,
    groupOrderId: Uuid,
  ) {
    const masterWorker = await this.bybitSubAccWorkerRepository.findOne({
      where: {
        id: createGroupOrderDto.masterWorkerId,
      },
      relations: {
        martingale2: true,
      },
    });

    if (masterWorker === null) {
      throw new WorkerNotFoundException('Worker not found!');
    }

    if (
      createGroupOrderDto.initialCapital !== undefined &&
      createGroupOrderDto.minCapital !== undefined &&
      createGroupOrderDto.maxCapital !== undefined
    ) {
      masterWorker.initialCapital = createGroupOrderDto.initialCapital;
      masterWorker.minCapital = createGroupOrderDto.minCapital;
      masterWorker.maxCapital = createGroupOrderDto.maxCapital;
    }

    // assign all the entities into create dto
    const martingale2Dto = {
      ...masterWorker,
      ...masterWorker.martingale2,
    };
    const createMartingale2Dto = new CreateMartingale2Dto();

    for (const key in createMartingale2Dto) {
      if (
        // eslint-disable-next-line no-prototype-builtins
        martingale2Dto.hasOwnProperty(key) &&
        createMartingale2Dto[key] == null
      ) {
        createMartingale2Dto[key] = martingale2Dto[key];
      }
    }

    const allWorkers: Uuid[] = [];
    let index = 0;

    for (const bybitSubAccId of createGroupOrderDto.bybitSubAccIds) {
      index = index += 1;

      createMartingale2Dto.bybitSubAccId = bybitSubAccId;
      const entryPricePercentage =
        index * createGroupOrderDto.priceEntryDiffPercentage;

      const worker = // eslint-disable-next-line no-await-in-loop
        await this.martingale2Service.createMartingale2(createMartingale2Dto);
      allWorkers.push(worker.workerId);

      const createGroupOrderWorkerDto = new CreateGroupOrderWorkerDto();
      createGroupOrderWorkerDto.index = index;
      createGroupOrderWorkerDto.entryPricePercentage = entryPricePercentage;
      createGroupOrderWorkerDto.groupOrderId = groupOrderId;
      createGroupOrderWorkerDto.workerId = worker.workerId;
      // eslint-disable-next-line no-await-in-loop
      await this.createGroupOrderWorker(createGroupOrderWorkerDto);
    }

    return allWorkers;
  }

  async createGroupOrderWorker(
    createGroupOrderWorkerDto: CreateGroupOrderWorkerDto,
  ) {
    const groupOrderWorker = this.groupOrderWorkerRepository.create(
      createGroupOrderWorkerDto,
    );
    await this.groupOrderWorkerRepository.save(groupOrderWorker);

    return groupOrderWorker;
  }
}
