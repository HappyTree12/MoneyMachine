import { Injectable } from '@nestjs/common';

import { BybitMasterDto } from '../dtos/bybit-master.dto';
import { BybitMasterApiFunction } from './bybit-master-api.function';

@Injectable()
export class BybitMainApiFunction extends BybitMasterApiFunction {
  private mainAccApiFullPermission = {
    ContractTrade: ['Order', 'Position'],
    Spot: ['SpotTrade'],
    Wallet: ['AccountTransfer', 'SubMemberTransfer'],
    Options: ['OptionsTrade'],
    Exchange: ['ExchangeHistory'],
  };

  constructor(protected bybitMasterDto: BybitMasterDto) {
    super(bybitMasterDto);
  }

  async refreshBybitMainApi() {
    await this.bybitHttp.updateMasterApiKey({
      permissions: this.mainAccApiFullPermission,
    });
  }

  /* Functions to add/modify subaccounts that required main API */
  async createBybitSubAcc(username: string, note?: string) {
    return this.bybitHttp
      .createSubMember({
        username,
        memberType: 1,
        note,
      })
      .then((value) => {
        const error = this.validateBybitHttpCode(value);
        this.handleBybitException(error);

        return value.result;
      });
  }

  async createBybitSubAccApi(subuid: number) {
    return this.bybitHttp
      .createSubUIDAPIKey({
        subuid,
        readOnly: 0,
        permissions: this.subAccApiFullPermission,
      })
      .then((value) => {
        const error = this.validateBybitHttpCode(value);
        this.handleBybitException(error);

        return value.result;
      });
  }
}
