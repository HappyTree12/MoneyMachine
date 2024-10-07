import { NumberField, UUIDField } from '../../../decorators';

export class CreateGroupOrderWorkerDto {
  @NumberField()
  index!: number;

  @NumberField()
  entryPricePercentage!: number;

  @UUIDField()
  workerId!: Uuid;

  @UUIDField()
  groupOrderId!: Uuid;
}
