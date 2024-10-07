import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { BybitMainAccService } from './bybit-main-acc.service';
import { BybitMainAccDTO } from './dtos/bybit-main-acc.dto';
import { CreateBybitMainAccDto } from './dtos/create-bybit-main-acc.dto';

@Controller('bybit-main-acc')
@ApiTags('bybit-main-acc')
export class BybitController {
  constructor(private bybitMainAccService: BybitMainAccService) {}

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get main bybit api',
    type: BybitMainAccDTO,
  })
  async getBybitApiInfoFromDb(
    @AuthUser() user: UserEntity,
  ): Promise<BybitMainAccDTO> {
    const bybitMainAcc =
      await this.bybitMainAccService.getBybitMainApiInfoFromDbByUserId(user.id);

    return bybitMainAcc.toDto();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.USER])
  @ApiCreatedResponse({ type: BybitMainAccDTO })
  async registerBybitMainAccApi(
    @Body() createBybitMainDto: CreateBybitMainAccDto,
    @AuthUser() user: UserEntity,
  ): Promise<BybitMainAccDTO> {
    const bybitApi = await this.bybitMainAccService.createBybitMainApi(
      createBybitMainDto,
      user.id,
    );

    return bybitApi.toDto();
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiCreatedResponse({ type: BybitMainAccDTO })
  async refreshBybitMainAccApiExpiredTimeByUserId(
    @AuthUser() user: UserEntity,
  ): Promise<BybitMainAccDTO> {
    return this.bybitMainAccService.refreshBybitMainAccApiExpiredTime(user.id);
  }
}
