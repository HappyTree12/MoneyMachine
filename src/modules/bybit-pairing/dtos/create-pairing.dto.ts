import { InstrumentStatusV5 } from 'bybit-api';

import { BooleanField, NumberField, StringField } from '../../../decorators';

export class CreatePairingDto {
  @StringField()
  symbol!: string;

  @StringField()
  contractType!: string;

  @StringField()
  status!: InstrumentStatusV5;

  @StringField()
  baseCoin!: string;

  @StringField()
  quoteCoin!: string;

  @NumberField()
  priority!: number;

  @BooleanField()
  isActive!: boolean;
}
