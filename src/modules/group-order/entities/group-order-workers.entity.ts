import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { BybitSubAccWorkerEntity } from '../../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { BybitSubAccWorkerDTO } from '../../bybit-sub-acc-worker/dtos/bybit-sub-acc-worker.dto';
import { GroupOrderEntity } from './group-order.entity';

@Entity({ name: 'group-order-workers' })
@UseDto(BybitSubAccWorkerDTO)
export class GroupOrderWorkersEntity extends AbstractEntity<BybitSubAccWorkerDTO> {
  @Column({ type: 'int' })
  index!: number;

  @Column({ type: 'float' })
  entryPricePercentage!: number;

  @Column({ type: 'uuid' })
  workerId!: Uuid;

  @Column({ type: 'float' })
  groupOrderId!: Uuid;

  @ManyToOne(
    () => GroupOrderEntity,
    (groupOrder) => groupOrder.groupOrderWorkers,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'group_order_id' })
  groupOrder!: GroupOrderEntity;

  @ManyToOne(
    () => BybitSubAccWorkerEntity,
    (bybitSubAccWorker) => bybitSubAccWorker.followerGroupOrder,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'worker_id' })
  bybitSubAccWorker!: BybitSubAccWorkerEntity;
}
