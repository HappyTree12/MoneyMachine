import { Column } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { BaseSignalDto } from '../base-dto/signal-base.dto';

export abstract class BaseSignalEntity<
  T extends BaseSignalDto,
  W,
> extends AbstractEntity<T, W> {
  @Column({ type: 'int' })
  initiateCandles!: number;

  @Column({ type: 'int' })
  interval!: number;

  @Column({ type: 'int' })
  positionMode!: number;

  @Column({ type: 'float' })
  margin!: number;

  @Column({ type: 'float', nullable: true, default: null })
  firstTpRatio?: number;

  @Column({ type: 'float' })
  tpRatio!: number;

  @Column({ type: 'float' })
  slRatio!: number;

  @Column({ type: 'boolean', default: false })
  isPartialMode!: boolean;
}
