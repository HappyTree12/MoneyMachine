import { setTimeout } from 'node:timers/promises';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  workerRunningStatus,
  WorkerStatus,
} from '../../constants/worker-status';
import {
  BybitApiNotFoundException,
  BybitApiNotValidException,
} from '../../exceptions/bybit-api.exception';
import { ExceptionNotRecognise } from '../../exceptions/exception-not-recognise.exception';
import {
  WorkerIsNotRunningException,
  WorkerIsRunningException,
  WorkerNotFoundException,
} from '../../exceptions/worker-exception';
import { CommandLineService } from '../../shared/services/command-line.service';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { BybitSubAccDTO } from '../bybit-sub-acc/dtos/bybit-sub-acc.dto';
import { BybitSubAccWorkerEntity } from './bybit-sub-acc-worker.entity';
import { BybitSubAccWorkerDTO } from './dtos/bybit-sub-acc-worker.dto';
import { CreateBybitSubAccWorkerDto } from './dtos/create-bybit-sub-acc-worker.dto';

@Injectable()
export class BybitSubAccWorkerService {
  constructor(
    @InjectRepository(BybitSubAccWorkerEntity)
    private bybitSubAccWorkerRepository: Repository<BybitSubAccWorkerEntity>,

    @InjectRepository(BybitSubAccEntity)
    private bybitSubAccRepository: Repository<BybitSubAccEntity>,
    private commandLineService: CommandLineService,
  ) {}

  @Transactional()
  async getBybitSubAccWorkersByBybitSubAccId(
    bybitSubAccId: Uuid,
  ): Promise<BybitSubAccWorkerDTO[]> {
    try {
      const bybitSubAccWorkerEntity =
        await this.bybitSubAccWorkerRepository.find({
          relations: {
            bybitSubAcc: true,
          },
          where: {
            bybitSubAcc: {
              id: bybitSubAccId,
            },
          },
        });

      if (bybitSubAccWorkerEntity.length === 0) {
        throw new BybitApiNotFoundException('No subaccount worker found!');
      }

      return bybitSubAccWorkerEntity.toDtos();
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  @Transactional()
  async createBybitSubAccWorker(
    createBybitSubAccWorkerDto: CreateBybitSubAccWorkerDto,
  ): Promise<BybitSubAccWorkerDTO> {
    try {
      const bybitSubAcc = await this.bybitSubAccRepository.findOne({
        where: { id: createBybitSubAccWorkerDto.bybitSubAccId },
      });

      if (bybitSubAcc === null) {
        throw new BybitApiNotFoundException(
          'Unable to find bybit subaccount in our record!',
        );
      }

      const runningWorkers = await this.bybitSubAccWorkerRepository.find({
        where: {
          bybitSubAccId: createBybitSubAccWorkerDto.bybitSubAccId,
          workerStatus: In(workerRunningStatus),
          category: createBybitSubAccWorkerDto.category,
          symbol: createBybitSubAccWorkerDto.symbol,
        },
      });

      if (runningWorkers.length > 0) {
        throw new WorkerIsRunningException(
          `A worker with (${createBybitSubAccWorkerDto.symbol}) pairing is running on this subaccount.
          Please onhold until the worker to completed or stop the worker instead`,
        );
      }

      const worker = this.bybitSubAccWorkerRepository.create(
        createBybitSubAccWorkerDto,
      );
      await this.bybitSubAccWorkerRepository.save(worker);

      return worker;
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new ExceptionNotRecognise(error);
    }
  }

  @Transactional()
  async stopBybitSubAccWorker(workerId: Uuid): Promise<BybitSubAccWorkerDTO> {
    try {
      const bybitSubAccWorker = await this.bybitSubAccWorkerRepository.findOne({
        where: { id: workerId },
      });

      if (bybitSubAccWorker?.workerStatus !== WorkerStatus.running) {
        throw new WorkerIsNotRunningException('Worker is not running!');
      }

      bybitSubAccWorker.workerStatus = WorkerStatus.stopped;
      bybitSubAccWorker.statusDescription = 'Worker stopped by user manually';
      const processId = bybitSubAccWorker.processId;

      if (processId === undefined || processId === '') {
        bybitSubAccWorker.statusDescription =
          'Worker stopped without stopping process due to no process id';
      } else {
        // Kill process if processId exist
        const err = this.commandLineService.stopProcess(processId);

        if (err !== null) {
          bybitSubAccWorker.statusDescription = `An error occured while stopping process due to: ${err.message}\nWorker might still running`;
        }

        // wait for 5 seconds to let python update worker status
        await setTimeout(5000);

        // check worker status again
        const bybitSubAccWorkerCurrent =
          await this.bybitSubAccWorkerRepository.findOne({
            where: { id: workerId },
          });

        // Python will get the signal to close and update worker status.
        if (bybitSubAccWorkerCurrent?.workerStatus !== WorkerStatus.stopped) {
          bybitSubAccWorker.statusDescription =
            "Worker doesn't stop from background process and it might still running";
        }
      }

      await this.bybitSubAccWorkerRepository.save(bybitSubAccWorker);

      return bybitSubAccWorker.toDto();
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new ExceptionNotRecognise(error);
    }
  }

  async getSubAccWithActiveWorkerByWorkerId(
    userId: Uuid,
    workerId: Uuid,
  ): Promise<BybitSubAccDTO[]> {
    try {
      const activeSubAcc: BybitSubAccDTO[] = [];
      const bybitSubAccWorkerEntity =
        await this.bybitSubAccWorkerRepository.findOne({
          where: {
            id: workerId,
          },
        });

      if (bybitSubAccWorkerEntity === null) {
        throw new WorkerNotFoundException(`Worker id ${workerId} not found!`);
      }

      const bybitSubAccEntity = await this.bybitSubAccRepository.find({
        relations: {
          bybitMainAcc: true,
          workers: true,
        },
        where: {
          bybitMainAcc: {
            userId,
          },
        },
      });

      for (const bybitSubAcc of bybitSubAccEntity) {
        const workers = bybitSubAcc.workers;
        let isWorkerRunning = false;

        if (workers === undefined) {
          activeSubAcc.push(bybitSubAcc.toDto());
          continue;
        }

        for (const worker of workers) {
          if (
            workerRunningStatus.includes(worker.workerStatus) &&
            worker.category === bybitSubAccWorkerEntity.category &&
            worker.symbol === bybitSubAccWorkerEntity.symbol
          ) {
            isWorkerRunning = true;
            break;
          }
        }

        if (!isWorkerRunning) {
          activeSubAcc.push(bybitSubAcc.toDto());
        }
      }

      return activeSubAcc;
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }

  async getSubAccWorkerInfoWithStrategy(
    workerId: Uuid,
  ): Promise<BybitSubAccWorkerEntity> {
    try {
      const bybitSubAccWorkerEntity =
        await this.bybitSubAccWorkerRepository.findOne({
          relations: {
            martingale2: true,
          },
          where: {
            id: workerId,
          },
        });

      if (bybitSubAccWorkerEntity === null) {
        throw new BybitApiNotFoundException(
          `Unable to find worker with id ${workerId}`,
        );
      }

      return bybitSubAccWorkerEntity;
    } catch (error_) {
      if (error_ instanceof HttpException) {
        throw error_;
      }

      const error = (error_ as Error).message;

      throw new BybitApiNotValidException(error);
    }
  }
}
