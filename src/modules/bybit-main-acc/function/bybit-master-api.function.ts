import { type HttpException, Injectable } from '@nestjs/common';
import {
  type APIResponseV3,
  type APIResponseV3WithTime,
  RestClientV5,
} from 'bybit-api';

import {
  BybitApiRequestNotAcceptableException,
  BybitApiServerTimeNotMatch,
} from '../../../exceptions/bybit-api.exception';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { BybitMasterDto } from '../dtos/bybit-master.dto';

@Injectable()
export class BybitMasterApiFunction {
  // To store the function to allow main/sub API to execute
  protected bybitHttp: RestClientV5;

  protected subAccApiFullPermission = {
    ContractTrade: ['Order', 'Position'],
    Spot: ['SpotTrade'],
    Wallet: ['AccountTransfer'],
    Options: ['OptionsTrade'],
    Exchange: ['ExchangeHistory'],
  };

  private encryptionService: EncryptionService;

  constructor(protected bybitMasterDto: BybitMasterDto) {
    this.encryptionService = new EncryptionService();
    // Decrypt the apiSecret before creating the RestClientV5 instance
    const decryptedApiSecret = this.encryptionService.decrypt(
      bybitMasterDto.apiSecret,
    );

    this.bybitHttp = new RestClientV5(
      {
        key: this.bybitMasterDto.apiKey,
        secret: decryptedApiSecret,
        testnet: this.bybitMasterDto.isTestNet,
        enable_time_sync: true,
        // Optional: enable to try parsing rate limit values from responses
        // parseAPIRateLimits: true
      },
      // requestLibraryOptions
    );
  }

  async getBybitApiInfo() {
    return this.bybitHttp.getQueryApiKey().then((value) => {
      const error = this.validateBybitHttpCode(value);
      this.handleBybitException(error);

      return value.result;
    });
  }

  validateBybitHttpCode(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    value: APIResponseV3WithTime<any> | APIResponseV3<any>,
  ) {
    if (value.retCode === 10_002) {
      return new BybitApiServerTimeNotMatch(value.retMsg);
    }

    if (value.retCode !== 0) {
      return new BybitApiRequestNotAcceptableException(value.retMsg);
    }
  }

  handleBybitException(error: HttpException | undefined) {
    if (error === undefined) {
      return;
    }

    throw error;
  }

  async testBybitApi(): Promise<boolean> {
    try {
      await this.bybitHttp.getAccountInfo();

      return true;
    } catch {
      return false;
    }
  }

  getBybitHttp() {
    return this.bybitHttp;
  }
}
