import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StrategyType } from '../../../constants/strategy-type';
import { WorkerStatus } from '../../../constants/worker-status';
import {
  BooleanField,
  ClassField,
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators';
import { BybitSubAccDTO } from '../../bybit-sub-acc/dtos/bybit-sub-acc.dto';
import { type BybitSubAccWorkerEntity } from '../bybit-sub-acc-worker.entity';

export class BybitSubAccWorkerDTO extends AbstractDto {
  @EnumField(() => StrategyType)
  strategyType!: StrategyType;

  @StringField()
  marginMode!: string;

  @StringField()
  category!: string;

  @StringField()
  symbol!: string;

  @NumberField()
  leverage!: number;

  @NumberField()
  initialCapital!: number;

  @NumberField()
  minCapital!: number;

  @NumberField()
  maxCapital!: number;

  @NumberField()
  entryPrice?: number;

  @EnumField(() => WorkerStatus)
  workerStatus!: WorkerStatus;

  @StringFieldOptional()
  statusDescription?: string;

  @StringFieldOptional()
  processId?: string;

  @BooleanField()
  isLoop?: boolean;

  @UUIDField()
  bybitSubAccId!: Uuid;

  @ClassField(() => BybitSubAccDTO)
  bybitSubAcc?: BybitSubAccDTO;

  constructor(worker: BybitSubAccWorkerEntity) {
    super(worker);
    this.strategyType = worker.strategyType;
    this.marginMode = worker.marginMode;
    this.category = worker.category;
    this.symbol = worker.symbol;
    this.leverage = worker.leverage;
    this.initialCapital = worker.initialCapital;
    this.minCapital = worker.minCapital;
    this.maxCapital = worker.maxCapital;
    this.entryPrice = worker.entryPrice;
    this.workerStatus = worker.workerStatus;
    this.statusDescription = worker.statusDescription;
    this.processId = worker.processId;
    this.isLoop = worker.isLoop;
    this.bybitSubAccId = worker.bybitSubAccId;
    this.bybitSubAcc = worker.bybitSubAcc?.toDto();
  }
}
