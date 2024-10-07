import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { BybitSubAccEntity } from '../bybit-sub-acc/bybit-sub-acc.entity';
import { type UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { BybitMainAccDTO } from './dtos/bybit-main-acc.dto';

@Entity({ name: 'bybit-main-acc' })
@UseDto(BybitMainAccDTO)
export class BybitMainAccEntity extends AbstractEntity<
  BybitMainAccDTO,
  UserDto
> {
  @Column({ unique: true, type: 'varchar' })
  apiKey!: string;

  @Column({ type: 'varchar' })
  apiSecret!: string;

  @Column({ type: 'boolean' })
  isTestNet!: boolean;

  @Column({ type: 'int' })
  accUid!: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt!: Date;

  @Column({ type: 'uuid' })
  userId!: Uuid;

  @OneToOne(() => UserEntity, (user) => user.bybitMainAcc, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(
    () => BybitSubAccEntity,
    (bybitSubEntity) => bybitSubEntity.bybitMainAcc,
  )
  bybitSubAcc?: BybitSubAccEntity[];
}
