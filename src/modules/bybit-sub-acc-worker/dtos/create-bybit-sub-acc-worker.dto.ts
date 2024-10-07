import { StrategyType } from '../../../constants/strategy-type';
import {
  BooleanField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators';

export class CreateBybitSubAccWorkerDto {
  strategyType!: StrategyType;

  @StringField()
  marginMode!: string;

  @StringField()
  category!: string;

  @StringField()
  symbol!: string;

  @NumberField()
  initialCapital!: number;

  @NumberField()
  minCapital!: number;

  @NumberField()
  maxCapital!: number;

  @NumberField()
  leverage!: number;

  @BooleanField()
  isLoop?: boolean;

  @UUIDField()
  bybitSubAccId!: Uuid;
}
