import { EmailField, PasswordFieldOptional, StringField } from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @StringField()
  readonly otp!: string;

  @PasswordFieldOptional({ minLength: 6 })
  readonly password?: string;

  @StringField()
  readonly telegramChatId?: string;
}
