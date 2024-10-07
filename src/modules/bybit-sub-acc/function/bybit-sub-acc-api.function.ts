import { Injectable } from '@nestjs/common';

import { BybitMasterDto } from '../../bybit-main-acc/dtos/bybit-master.dto';
import { BybitMasterApiFunction } from '../../bybit-main-acc/function/bybit-master-api.function';

@Injectable()
export class BybitSubApiFunction extends BybitMasterApiFunction {
  constructor(protected bybitSubParentDto: BybitMasterDto) {
    super(bybitSubParentDto);
  }

  async refreshBybitSubApi() {
    await this.bybitHttp.updateSubApiKey({
      permissions: this.subAccApiFullPermission,
    });
  }
}
