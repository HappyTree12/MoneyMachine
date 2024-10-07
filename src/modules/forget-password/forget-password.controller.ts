import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import {
  ChangePasswordFailedException,
  ForgetPasswordRequestSessionFailed,
} from '../../exceptions';
import { UserDto } from '../user/dtos/user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { RequestSessionDto } from './dtos/request-session.dto';
import { ForgetPasswordService } from './forget-password.service';

@Controller('forget-password')
@ApiTags('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post('/request-session')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Forget password session created successfully',
  })
  async request(
    @Body() requestSessionDto: RequestSessionDto,
  ): Promise<{ message: string }> {
    try {
      await this.forgetPasswordService.requestChangePassword(
        requestSessionDto.email,
      );

      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error(error);

      throw new ForgetPasswordRequestSessionFailed();
    }
  }

  @Post('/change-password')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'Password changed successfully',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> {
    try {
      return this.forgetPasswordService.changePassword(
        changePasswordDto.shortToken,
        changePasswordDto.newPassword,
      );
    } catch {
      throw new ChangePasswordFailedException();
    }
  }
}
