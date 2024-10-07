import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OtpDto } from './dto/otp.dto';

@Entity({ name: 'otps' })
@UseDto(OtpDto)
export class OtpEntity extends AbstractEntity<OtpDto> {
  @Column()
  otp!: string;

  @Column({ type: 'timestamp' })
  expiredAt!: Date;

  @Column()
  email!: string;
}
