import { InstrumentStatusV5 } from 'bybit-api';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { BybitPairingDto } from './dtos/bybit-pairing.dto';

@Entity({ name: 'bybit-pairing' })
@UseDto(BybitPairingDto)
export class BybitPairingEntity extends AbstractEntity<BybitPairingDto> {
  @Column({ type: 'varchar' })
  symbol!: string;

  @Column({ type: 'varchar' })
  contractType!: string;

  // Bybit Instrument Status
  @Column({ type: 'varchar', length: 20 })
  status!: InstrumentStatusV5;

  @Column({ type: 'varchar' })
  baseCoin!: string;

  @Column({ type: 'varchar' })
  quoteCoin!: string;

  // Priority of pairing in our system
  // 0 - Important
  // 1 - Not important
  @Column({ type: 'integer' })
  priority!: number;

  // Status of pairing in our system
  @Column({ type: 'boolean' })
  isActive!: boolean;
}
