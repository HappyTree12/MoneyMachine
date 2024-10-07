import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
import { BybitSubAccWorkerEntity } from '../bybit-sub-acc-worker/bybit-sub-acc-worker.entity';
import { type UserDto } from '../user/dtos/user.dto';
import { BybitSubAccDTO } from './dtos/bybit-sub-acc.dto';

@Entity({ name: 'bybit-sub-acc' })
@UseDto(BybitSubAccDTO)
export class BybitSubAccEntity extends AbstractEntity<BybitSubAccDTO, UserDto> {
  @Column({ unique: true, type: 'varchar' })
  apiKey!: string;

  @Column({ type: 'varchar' })
  apiSecret!: string;

  @Column({ type: 'boolean' })
  isTestNet!: boolean;

  @Column({ type: 'varchar' })
  accountName!: string;

  @Column({ type: 'int' })
  accUid!: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt!: Date;

  @Column({ type: 'uuid' })
  mainAccId!: Uuid;

  @ManyToOne(() => BybitMainAccEntity, (bybit) => bybit.bybitSubAcc, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'main_acc_id' })
  bybitMainAcc?: BybitMainAccEntity;

  @OneToMany(
    () => BybitSubAccWorkerEntity,
    (bybitSubAccWorkerEntity) => bybitSubAccWorkerEntity.bybitSubAcc,
  )
  workers?: BybitSubAccWorkerEntity[];
}
