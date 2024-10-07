import {
  BooleanFieldOptional,
  NumberField,
  NumberFieldOptional,
} from '../../decorators';
import { CreateBybitSubAccWorkerDto } from '../../modules/bybit-sub-acc-worker/dtos/create-bybit-sub-acc-worker.dto';

/**
 * Base DTO for creating a signal.
 *
 * This properties are expected while creating a signal bot within our application.
 */
export abstract class CreateBaseSignalDto extends CreateBybitSubAccWorkerDto {
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
