import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { BybitSubAccWorkerEntity } from '../../modules/bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { WorkerPnlDto } from './dtos/worker-pnl.dto';

@Entity({ name: 'worker-pnl' })
@UseDto(WorkerPnlDto)
export class WorkerPnlEntity extends AbstractEntity<WorkerPnlDto> {
  @Column({ type: 'float' })
  closedPnl!: number;

  @Column({ type: 'json' })
  pnlDetails!: Record<string, string | number>;

  @Column({ type: 'varchar', nullable: true, default: null })
  closingSide?: string;

  @Column({ type: 'uuid' })
  workerId!: Uuid;

  @ManyToOne(() => BybitSubAccWorkerEntity, (worker) => worker.workerPnl, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'worker_id' })
  worker?: BybitSubAccWorkerEntity;
}
