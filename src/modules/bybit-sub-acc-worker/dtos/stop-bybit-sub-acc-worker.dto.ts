import { UUIDField } from '../../../decorators';

export class StopBybitSubAccWorkerDto {
  @UUIDField()
  bybitSubAccWorkerId!: Uuid;
}
