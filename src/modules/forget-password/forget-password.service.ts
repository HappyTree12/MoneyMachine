import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';

import {
  ForgetPasswordSessionNotFound,
  MailerServiceException,
  TokenExpiredException,
  UserNotFoundException,
} from '../../exceptions';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { CreateForgetPasswordCommand } from './command/create-forget-password.command';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ForgetPasswordEntity } from './forget-password.entity';

@Injectable()
export class ForgetPasswordService {
  constructor(
    @InjectRepository(ForgetPasswordEntity)
    private forgetPasswordRepository: Repository<ForgetPasswordEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private commandBus: CommandBus,
  ) {}

  async findOneByToken(token: string): Promise<ForgetPasswordEntity | null> {
    return this.forgetPasswordRepository.findOne({ where: { token } });
  }

  async requestChangePassword(email: string): Promise<ForgetPasswordEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.createForgetPasswordSession(user.id, email);
  }

  async createForgetPasswordSession(
    userId: Uuid,
    email: string,
  ): Promise<ForgetPasswordEntity> {
    const token = await this.jwtService.signAsync(
      { email },
      { expiresIn: '10m' },
    );
    const shortToken = nanoid();
    const newForgetPassword = this.commandBus.execute<
      CreateForgetPasswordCommand,
      ForgetPasswordEntity
    >(new CreateForgetPasswordCommand({ userId, email, token, shortToken }));

    await this.sendMail(email, shortToken);

    return newForgetPassword;
  }

  async changePassword(token: string, newPassword: string): Promise<UserDto> {
    const session = await this.findJwtTokenWithShortToken(token);

    try {
      await this.jwtService.verifyAsync(session.token);
    } catch {
      throw new TokenExpiredException();
    }

    const user = await this.userRepository.findOne({
      where: { id: session.userId },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    user.password = newPassword;
    const newUser = await this.userRepository.save(user);

    return newUser.toDto();
  }

  async sendMail(email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Change Password Link',
        template: './forget-password-email',
        context: {
          link: `${process.env.BASE_URL}/forgot-password/${token}`,
        },
      });
    } catch {
      throw new MailerServiceException();
    }
  }

  async findJwtTokenWithShortToken(
    shortToken: string,
  ): Promise<ForgetPasswordDto> {
    const forgetPassword = await this.forgetPasswordRepository.findOne({
      where: { shortToken },
    });

    if (!forgetPassword) {
      throw new ForgetPasswordSessionNotFound();
    }

    return forgetPassword.toDto();
  }
}
