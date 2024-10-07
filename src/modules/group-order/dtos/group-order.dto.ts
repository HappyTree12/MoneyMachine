import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ClassField, NumberField, UUIDField } from '../../../decorators';
import { GroupOrderEntity } from '../entities/group-order.entity';
import { GroupOrderWorkersEntity } from '../entities/group-order-workers.entity';

export class GroupOrderDTO extends AbstractDto {
  @NumberField()
  priceEntryDiffPercentage!: number;

  @NumberField()
  initialCapital!: number;

  @NumberField()
  minCapital!: number;

  @NumberField()
  maxCapital!: number;

  @UUIDField()
  masterWorkerId!: Uuid;

  @ClassField(() => GroupOrderWorkersEntity)
  groupOrderWorkers?: GroupOrderWorkersEntity[];

  constructor(groupOrder: GroupOrderEntity) {
    super(groupOrder);
    this.priceEntryDiffPercentage = groupOrder.priceEntryDiffPercentage;
    this.masterWorkerId = groupOrder.masterWorkerId;
    this.groupOrderWorkers = groupOrder.groupOrderWorkers;
  }
}
