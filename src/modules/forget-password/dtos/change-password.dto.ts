import { StringField } from '../../../decorators';

export class ChangePasswordDto {
  @StringField()
  shortToken!: string;

  @StringField()
  newPassword!: string;
}
