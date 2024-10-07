import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { type CreateOtpDto } from './dto/create-otp.dto';
import { OtpEntity } from './otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private readonly mailerService: MailerService,
  ) {}

  findOne(findData: FindOptionsWhere<OtpEntity>): Promise<OtpEntity | null> {
    return this.otpRepository.findOneBy(findData);
  }

  async findLatestByEmail(email: string): Promise<OtpEntity | null> {
    const now = new Date();

    return this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.email = :email', { email })
      .andWhere('otp.expiredAt > :now', { now })
      .orderBy('otp.expiredAt', 'DESC')
      .getOne();
  }

  create(createOtpDto: CreateOtpDto) {
    const otpEntity = this.otpRepository.create({
      email: createOtpDto.email,
      otp: createOtpDto.otp,
      expiredAt: createOtpDto.expiredAt,
    });

    return this.otpRepository.save(otpEntity);
  }

  async sendOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Registration OTP', // Subject line
      template: './register-otp', // The template name
      context: {
        otp, // Data to be passed to the template
      },
    });

    return true;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    // Fetch the OTP record from the database or storage
    const otpRecord = await this.otpRepository.findOneBy({
      email,
      otp,
    });

    if (!otpRecord) {
      return false; // OTP not found or invalid
    }

    // Check if the OTP has expired
    const now = new Date();

    return !(otpRecord.expiredAt < now);
  }
}
