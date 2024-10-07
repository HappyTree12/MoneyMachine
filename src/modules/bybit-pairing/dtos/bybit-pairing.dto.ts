import { InstrumentStatusV5 } from 'bybit-api';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../../decorators';
import { type BybitPairingEntity } from '../bybit-pairing.entity';

export class BybitPairingDto extends AbstractDto {
  @StringFieldOptional()
  symbol!: string;

  @StringFieldOptional()
  contractType!: string;

  @StringFieldOptional()
  status!: InstrumentStatusV5;

  @StringFieldOptional()
  baseCoin!: string;

  @StringFieldOptional()
  quoteCoin!: string;

  @NumberFieldOptional()
  priority!: number;

  @BooleanFieldOptional()
  isActive!: boolean;

  constructor(pair: BybitPairingEntity) {
    super(pair);
    this.symbol = pair.symbol;
    this.contractType = pair.contractType;
    this.status = pair.status;
    this.baseCoin = pair.baseCoin;
    this.quoteCoin = pair.quoteCoin;
    this.priority = pair.priority;
    this.isActive = pair.isActive;
  }
}
