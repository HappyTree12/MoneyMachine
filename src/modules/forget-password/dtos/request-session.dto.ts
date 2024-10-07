import { StringField } from '../../../decorators';

export class RequestSessionDto {
  @StringField()
  email!: string;
}
