import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { random } from 'lodash';
import moment from 'moment';

import { RoleType } from '../../constants';
import { ApiFile, Auth, AuthUser } from '../../decorators';
import { OtpInvalidExpiredException } from '../../exceptions/otp-invalid-expired.exception';
import { IFile } from '../../interfaces';
import { OtpService } from '../otp/otp.service';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private otpService: OtpService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    // Check if the OTP is valid and not expired
    const isValid = await this.otpService.verifyOtp(
      userRegisterDto.email,
      userRegisterDto.otp,
    );

    if (!isValid) {
      throw new OtpInvalidExpiredException();
    }

    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }

  @Post('/send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const now = new Date();

    // Check if there is an existing, non-expired OTP for the email
    const existingOtp = await this.otpService.findLatestByEmail(
      sendOtpDto.email,
    );

    let otp: string;
    let expiredAt: Date;

    if (existingOtp && existingOtp.expiredAt > now) {
      // Use the existing OTP
      otp = existingOtp.otp;
      expiredAt = existingOtp.expiredAt;
    } else {
      // Generate a new OTP
      otp = random(100_000, 999_999).toString();
      expiredAt = moment.utc().add(10, 'minutes').toDate();

      // Save to database
      await this.otpService.create({
        email: sendOtpDto.email,
        otp,
        expiredAt,
      });
    }

    // Send otp to email
    await this.otpService.sendOtp(sendOtpDto.email, otp);

    return { message: 'OTP sent to your email' };
  }
}
