import { UUIDField } from '../../../decorators';

export class RefreshBybitSubAccBySubAccIdDto {
  @UUIDField()
  subAccId!: Uuid;
}

export class RefreshBybitSubAccByMainAccIdDto {
  @UUIDField()
  mainAccId!: Uuid;
}
