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
import { BybitSubAccService } from './bybit-sub-acc.service';
import { BybitSubAccDTO } from './dtos/bybit-sub-acc.dto';
import { CreateBybitSubAccDto } from './dtos/create-bybit-sub-acc.dto';
import {
  RefreshBybitSubAccByMainAccIdDto,
  RefreshBybitSubAccBySubAccIdDto,
} from './dtos/refresh-bybit-sub-acc.dto';

@Controller('bybit-sub-acc')
@ApiTags('bybit-sub-acc')
export class BybitSubController {
  constructor(private bybitSubAccService: BybitSubAccService) {}

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get sub bybit api',
    type: BybitSubAccDTO,
  })
  async getBybitApiInfoFromDb(
    @AuthUser() user: UserEntity,
  ): Promise<BybitSubAccDTO[]> {
    return this.bybitSubAccService.getBybitSubApiInfoFromDbByUserId(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.USER])
  @ApiCreatedResponse({ type: BybitSubAccDTO })
  async bybitRegister(
    @Body() createBybitSubDto: CreateBybitSubAccDto,
  ): Promise<BybitSubAccDTO> {
    const bybitApi =
      await this.bybitSubAccService.createBybitSubApi(createBybitSubDto);

    return bybitApi.toDto();
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiCreatedResponse({ type: BybitSubAccDTO })
  async bybitRefreshSubAccExpiredTime(
    @Body() refreshBybitSubBySubAccIdDto: RefreshBybitSubAccBySubAccIdDto,
  ): Promise<BybitSubAccDTO> {
    return this.bybitSubAccService.refreshBybitSubApiExpiredTimeBySubAccId(
      refreshBybitSubBySubAccIdDto,
    );
  }

  @Post('/refresh/all')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiCreatedResponse({ type: BybitSubAccDTO })
  async bybitRefreshAllSubAccExpiredTime(
    @Body() refreshBybitSubByMainAccIdDto: RefreshBybitSubAccByMainAccIdDto,
  ) {
    await this.bybitSubAccService.refreshBybitSubApiExpiredTimeByMainAccId(
      refreshBybitSubByMainAccIdDto,
    );
  }
}
