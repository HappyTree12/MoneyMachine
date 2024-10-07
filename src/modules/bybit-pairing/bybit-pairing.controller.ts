import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ContractType } from '../../constants';
// import { Auth } from '../../decorators';
import { BybitPairingService } from './bybit-pairing.service';
import { GetPairingDto } from './dtos/get-pairing.dto';
import { RetrievePairingDto } from './dtos/retrieve-pairing.dto';
import { TriggerPairingUpdateDto } from './dtos/trigger-pairing-update.dto';

@Controller('bybit-pairing')
@ApiTags('bybit-pairing')
export class BybitPairingController {
  constructor(private readonly bybitPairingService: BybitPairingService) {}

  @Post('/update-pairing')
  // @Auth([RoleType.ADMIN])
  @HttpCode(200)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update bybit pairing in our system.',
  })
  async update(
    @Body() triggerPairingUpdateDto: TriggerPairingUpdateDto,
  ): Promise<{ message: string }> {
    const { updated, deleted } = await this.bybitPairingService.updatePairing(
      triggerPairingUpdateDto,
    );

    return {
      message: `Updated ${updated} rows in our system. \nDeleted ${deleted} rows in our system.`,
    };
  }

  @Get('/get-pairing')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RetrievePairingDto,
    description: 'List of bybit pairings according to contract type(s).',
  })
  @ApiQuery({
    name: 'contractTypes',
    enum: ContractType,
    isArray: true,
    required: true,
  })
  async getPairings(
    @Query()
    pairingDto: GetPairingDto,
  ): Promise<RetrievePairingDto[]> {
    const contractTypes = pairingDto.contractTypes;
    const contracts =
      typeof contractTypes === 'string' ? [contractTypes] : contractTypes;

    return this.bybitPairingService.getPairingByContractType(contracts);
  }
}
