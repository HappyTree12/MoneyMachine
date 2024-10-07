import { AbstractDto } from '../../common/dto/abstract.dto';
import {
  BooleanFieldOptional,
  NumberField,
  NumberFieldOptional,
} from '../../decorators';

/**
 * Base DTO for a signal.
 *
 * This properties are expected in a signal bot.
 */
export abstract class BaseSignalDto extends AbstractDto {
  @NumberField()
  initiateCandles!: number;

  @NumberField()
  interval!: number;

  @NumberField()
  positionMode!: number;

  @NumberField()
  margin!: number;

  @NumberFieldOptional({ nullable: true })
  firstTpRatio?: number;

  @NumberField()
  tpRatio!: number;

  @NumberField()
  slRatio!: number;

  @BooleanFieldOptional({ default: false })
  isPartialMode!: boolean;
}
