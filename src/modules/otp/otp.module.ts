import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';

import { OtpEntity } from './otp.entity';
import { OtpService } from './otp.service';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
