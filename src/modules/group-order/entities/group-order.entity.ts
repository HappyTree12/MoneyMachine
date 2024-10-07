import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { BybitSubAccWorkerEntity } from '../../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { GroupOrderDTO } from '../dtos/group-order.dto';
import { GroupOrderWorkersEntity } from './group-order-workers.entity';

@Entity({ name: 'group-order' })
@UseDto(GroupOrderDTO)
export class GroupOrderEntity extends AbstractEntity<GroupOrderDTO> {
  @Column({ type: 'float' })
  priceEntryDiffPercentage!: number;

  @Column({ type: 'float' })
  initialCapital!: number;

  @Column({ type: 'float', default: 0 })
  minCapital!: number;

  @Column({ type: 'float', default: 0 })
  maxCapital!: number;

  @Column({ type: 'uuid' })
  masterWorkerId!: Uuid;

  @ManyToOne(
    () => BybitSubAccWorkerEntity,
    (bybitSubAccWorker) => bybitSubAccWorker.masterGroupOrder,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'master_worker_id' })
  masterWorker!: BybitSubAccWorkerEntity;

  @OneToMany(
    () => GroupOrderWorkersEntity,
    (groupOrderWorkersEntity) => groupOrderWorkersEntity.groupOrder,
  )
  groupOrderWorkers?: GroupOrderWorkersEntity[];
}
