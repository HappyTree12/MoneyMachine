import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField, UUIDField } from '../../../decorators';
import { ForgetPasswordEntity } from '../forget-password.entity';

export class ForgetPasswordDto extends AbstractDto {
  @StringField()
  email!: string;

  // JWT TOKEN
  @StringField()
  token!: string;

  @StringField()
  shortToken!: string;

  @UUIDField()
  userId!: Uuid;

  constructor(forgetPassword: ForgetPasswordEntity) {
    super(forgetPassword);
    this.email = forgetPassword.email;
    this.token = forgetPassword.token;
    this.userId = forgetPassword.userId;
  }
}
