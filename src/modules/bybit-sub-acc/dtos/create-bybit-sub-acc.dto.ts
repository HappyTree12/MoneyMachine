import { StringField, UUIDField } from '../../../decorators';

export class CreateBybitSubAccDto {
  @StringField()
  apiUsername!: string;

  @UUIDField()
  mainAccId!: Uuid;
}
