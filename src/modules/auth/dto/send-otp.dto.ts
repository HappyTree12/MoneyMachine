import { EmailField } from '../../../decorators';

export class SendOtpDto {
  @EmailField()
  readonly email!: string;
}
