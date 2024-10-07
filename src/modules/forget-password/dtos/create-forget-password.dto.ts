import { StringField, UUIDField } from '../../../decorators';

export class CreateForgetPasswordDto {
  @StringField()
  email!: string;

  @StringField()
  token!: string;

  @UUIDField()
  userId!: Uuid;

  @StringField()
  shortToken!: string;
}
