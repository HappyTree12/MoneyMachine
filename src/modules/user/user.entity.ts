import { Column, Entity, OneToMany, OneToOne, VirtualColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { BybitMainAccEntity } from '../bybit-main-acc/bybit-main-acc.entity';
import { ForgetPasswordEntity } from '../forget-password/forget-password.entity';
import { PostEntity } from '../post/post.entity';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  walletAddress!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  telegramChatId!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToOne(() => BybitMainAccEntity, (bybit) => bybit.user)
  bybitMainAcc?: BybitMainAccEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts?: PostEntity[];

  @OneToMany(
    () => ForgetPasswordEntity,
    (forgetPassword) => forgetPassword.user,
  )
  forgetPassword?: ForgetPasswordEntity;
}
