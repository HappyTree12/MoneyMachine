import { Injectable } from '@nestjs/common';
import { CategoryV5, InstrumentStatusV5, RestClientV5 } from 'bybit-api';

@Injectable()
export class MarketInstrumentInfoFunction {
  protected clientV5: RestClientV5;

  constructor() {
    this.clientV5 = new RestClientV5();
  }

  async getMarketInstrumentInfo(
    category: CategoryV5,
    status: InstrumentStatusV5,
    cursor?: string,
  ) {
    const data = await this.clientV5.getInstrumentsInfo({
      category,
      status,
      cursor,
    });

    return data.result;
  }
}
