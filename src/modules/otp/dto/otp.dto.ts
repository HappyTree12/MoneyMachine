import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { type OtpEntity } from '../otp.entity';

export class OtpDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp!: string;

  @ApiProperty()
  @IsDateString()
  expiredAt!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  constructor(otpEntity: OtpEntity) {
    super(otpEntity);

    this.otp = otpEntity.otp;
    this.expiredAt = otpEntity.expiredAt;
    this.email = otpEntity.email;
  }
}
