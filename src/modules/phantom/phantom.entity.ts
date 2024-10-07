import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { PhantomDto } from './dtos/phantom.dto';

@Entity({ name: 'phantom' })
@UseDto(PhantomDto)
export class PhantomEntity extends AbstractEntity<PhantomDto> {
  @Column({ type: 'bytea' })
  dappPublicKey?: Uint8Array;

  @Column({ type: 'bytea' })
  dappSecretkey?: Uint8Array;

  @Column({ type: 'bytea', nullable: true })
  sharedSecret?: Uint8Array;

  @Column({ type: 'integer' })
  chatId!: number;

  @Column({ type: 'varchar', nullable: true })
  sessionPublicKey?: string;

  @Column({ type: 'varchar', nullable: true })
  session?: string;
}
