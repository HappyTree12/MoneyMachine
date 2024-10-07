import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOtpDto {
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
}
