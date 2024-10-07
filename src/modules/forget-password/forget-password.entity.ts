import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { ForgetPasswordDto } from './dtos/forget-password.dto';

@Entity({ name: 'forget_password' })
@UseDto(ForgetPasswordDto)
export class ForgetPasswordEntity extends AbstractEntity<ForgetPasswordDto> {
  @Column({ type: 'uuid' })
  userId!: Uuid;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'varchar' })
  shortToken!: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.forgetPassword, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
