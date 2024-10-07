import { CategoryV5, InstrumentStatusV5 } from 'bybit-api';

import { StringField, StringFieldOptional } from '../../../decorators';

export class TriggerPairingUpdateDto {
  @StringField()
  category!: CategoryV5;

  @StringFieldOptional()
  status?: InstrumentStatusV5;

  constructor(category: CategoryV5, status?: InstrumentStatusV5) {
    this.category = category;
    this.status = status ?? 'Trading';
  }
}
