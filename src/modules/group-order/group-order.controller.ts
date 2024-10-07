import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { BotHubService } from '../bot-hub/bot-hub.service';
import { CreateGroupOrderDto } from './dtos/create-group-order.dto';
import { GroupOrderService } from './group-order.service';

@Controller('group-order')
@ApiTags('group-order')
export class GroupOrderController {
  constructor(
    private readonly groupOrderService: GroupOrderService,
    private readonly botHubService: BotHubService,
  ) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create group order',
    type: CreateGroupOrderDto,
  })
  async createGroupOrder(@Body() createGroupOrderDto: CreateGroupOrderDto) {
    const workersData =
      await this.groupOrderService.createGroupOrder(createGroupOrderDto);
    const groupOrderId = workersData.groupOrderId;
    const workersId = workersData.workersId;

    for (const worker of workersId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.botHubService.runWorkerFromBotHub({
        workerId: worker,
        groupOrderId,
      });
    }

    return { groupOrderId };
  }
}
