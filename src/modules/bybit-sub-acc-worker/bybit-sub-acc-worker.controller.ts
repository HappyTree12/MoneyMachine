import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { BybitSubAccDTO } from '../bybit-sub-acc/dtos/bybit-sub-acc.dto';
import { UserEntity } from '../user/user.entity';
import { BybitSubAccWorkerEntity } from './bybit-sub-acc-worker.entity';
import { BybitSubAccWorkerService } from './bybit-sub-acc-worker.service';
import { BybitSubAccWorkerDTO } from './dtos/bybit-sub-acc-worker.dto';
import { StopBybitSubAccWorkerDto } from './dtos/stop-bybit-sub-acc-worker.dto';

@Controller('bybit-sub-acc-workers')
@ApiTags('bybit-sub-acc-workers')
export class BybitSubAccWorkerController {
  constructor(private bybitSubAccWorkerService: BybitSubAccWorkerService) {}

  @Get('/:bybitSubAccId')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get sub acc workers api',
    type: BybitSubAccWorkerDTO,
  })
  async getBybitSubAccWorkers(
    @UUIDParam('bybitSubAccId') bybitSubAccId: Uuid,
  ): Promise<BybitSubAccWorkerDTO[]> {
    return this.bybitSubAccWorkerService.getBybitSubAccWorkersByBybitSubAccId(
      bybitSubAccId,
    );
  }

  @Post('/stop')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stop bybit sub acc worker',
    type: BybitSubAccWorkerDTO,
  })
  async stopBybitSubAccWorkers(
    @Body() stopBybitSubAccWorkerDto: StopBybitSubAccWorkerDto,
  ): Promise<BybitSubAccWorkerDTO> {
    return this.bybitSubAccWorkerService.stopBybitSubAccWorker(
      stopBybitSubAccWorkerDto.bybitSubAccWorkerId,
    );
  }

  @Get('activeWorkers/:workerId')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get bybit subaccount with active workers',
    type: BybitSubAccDTO,
  })
  async getActiveWorkers(
    @AuthUser() user: UserEntity,
    @UUIDParam('workerId') workerId: Uuid,
  ): Promise<BybitSubAccDTO[]> {
    return this.bybitSubAccWorkerService.getSubAccWithActiveWorkerByWorkerId(
      user.id,
      workerId,
    );
  }

  @Get('workerStrategy/:workerId')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get bybit subaccount worker with the strategy applied',
    type: BybitSubAccDTO,
  })
  async getWorkerWithStrategy(
    @UUIDParam('workerId') workerId: Uuid,
  ): Promise<BybitSubAccWorkerEntity> {
    return this.bybitSubAccWorkerService.getSubAccWorkerInfoWithStrategy(
      workerId,
    );
  }
}
