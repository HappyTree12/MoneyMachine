import { Expose } from 'class-transformer';

import { BooleanField, NumberField, StringField } from '../../../decorators';

export class RetrievePairingDto {
  @Expose()
  @StringField()
  symbol!: string;

  @Expose()
  @NumberField()
  priority!: number;

  @Expose()
  @BooleanField()
  isActive!: boolean;

  constructor(symbol: string, priority: number, isActive: boolean) {
    this.symbol = symbol;
    this.priority = priority;
    this.isActive = isActive;
  }
}
