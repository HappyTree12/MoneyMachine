import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { StrategyType } from '../../constants/strategy-type';
import { WorkerStatus } from '../../constants/worker-status';
import { UseDto } from '../../decorators';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { GroupOrderEntity } from '../group-order/entities/group-order.entity';
import { GroupOrderWorkersEntity } from '../group-order/entities/group-order-workers.entity';
import { Martingale1Entity } from '../martingale-1/martingale-1.entity';
import { Martingale1ComboEntity } from '../martingale-1-combo/martingale-1-combo.entity';
import { Martingale2Entity } from '../martingale-2/martingale-2.entity';
import { Matringale2ComboEntity } from '../martingale-2-combo/martingale-2-combo.entity';
import { Martingale3Entity } from '../martingale-3/martingale-3.entity';
import { Strategy1Entity } from '../strategy-1/strategy-1.entity';
import { Strategy2Entity } from '../strategy-2/strategy-2.entity';
import { Strategy3Entity } from '../strategy-3/strategy-3.entity';
import { Strategy5Entity } from '../strategy-5/strategy-5.entity';
import { WorkerPnlEntity } from '../worker-pnl/worker-pnl.entity';
import { BybitSubAccWorkerDTO } from './dtos/bybit-sub-acc-worker.dto';

@Entity({ name: 'bybit-sub-acc-worker' })
@UseDto(BybitSubAccWorkerDTO)
export class BybitSubAccWorkerEntity extends AbstractEntity<BybitSubAccWorkerDTO> {
  @Column({ type: 'enum', enum: StrategyType })
  strategyType!: StrategyType;

  @Column({ type: 'varchar' })
  marginMode!: string;

  @Column({ type: 'varchar', default: 'linear' })
  category!: string;

  @Column({ type: 'varchar' })
  symbol!: string;

  @Column({ type: 'int' })
  leverage!: number;

  @Column({ type: 'float' })
  initialCapital!: number;

  @Column({ type: 'float', default: 0 })
  minCapital!: number;

  @Column({ type: 'float', default: 0 })
  maxCapital!: number;

  @Column({ type: 'float', nullable: true })
  entryPrice?: number;

  @Column({ type: 'enum', enum: WorkerStatus, default: WorkerStatus.submitted })
  workerStatus!: WorkerStatus;

  @Column({ type: 'varchar', nullable: true })
  processId?: string;

  @Column({ type: 'boolean', default: false })
  isLoop?: boolean;

  @Column({ type: 'varchar', default: null })
  statusDescription?: string;

  @Column({ type: 'uuid' })
  bybitSubAccId!: Uuid;

  @ManyToOne(() => BybitSubAccEntity, (bybitSubAcc) => bybitSubAcc.workers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bybit_sub_acc_id' })
  bybitSubAcc?: BybitSubAccEntity;

  @OneToOne(
    () => Martingale2Entity,
    (martingale2Entity) => martingale2Entity.worker,
  )
  martingale2!: Martingale2Entity;

  @OneToOne(
    () => Matringale2ComboEntity,
    (martingale2Entity) => martingale2Entity.worker,
  )
  martingale2combo!: Matringale2ComboEntity;

  @OneToOne(
    () => Martingale1ComboEntity,
    (martingale1ComboEntity) => martingale1ComboEntity.worker,
  )
  martingale1combo!: Martingale1ComboEntity;

  @OneToMany(
    () => GroupOrderEntity,
    (groupOrderEntity) => groupOrderEntity.masterWorker,
  )
  masterGroupOrder?: GroupOrderEntity;

  @OneToMany(
    () => GroupOrderWorkersEntity,
    (groupOrderWorkerEntity) => groupOrderWorkerEntity.bybitSubAccWorker,
  )
  followerGroupOrder?: GroupOrderWorkersEntity;

  @OneToOne(
    () => Martingale1Entity,
    (martingale1Entity) => martingale1Entity.worker,
  )
  martingale1?: Martingale1Entity;

  @OneToOne(
    () => Martingale3Entity,
    (martingale3Entity) => martingale3Entity.worker,
  )
  martingale3?: Martingale3Entity;

  @OneToOne(() => Strategy1Entity, (strategy1Entity) => strategy1Entity.worker)
  strategy1?: Strategy1Entity;

  @OneToOne(() => Strategy2Entity, (strategy2Entity) => strategy2Entity.worker)
  strategy2?: Strategy2Entity;

  @OneToOne(() => Strategy3Entity, (strategy3Entity) => strategy3Entity.worker)
  strategy3?: Strategy3Entity;

  @OneToOne(() => Strategy5Entity, (strategy5Entity) => strategy5Entity.worker)
  strategy5?: Strategy5Entity;

  @OneToMany(() => WorkerPnlEntity, (workerPnl) => workerPnl.worker)
  workerPnl?: WorkerPnlEntity;
}
