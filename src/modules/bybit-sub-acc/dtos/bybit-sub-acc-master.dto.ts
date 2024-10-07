import {
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators';
import { BybitMasterDto } from '../../bybit-main-acc/dtos/bybit-master.dto';

export class BybitSubAccMasterDto extends BybitMasterDto {
  @StringField()
  accountName!: string;

  @NumberField()
  accUid!: number;

  @StringFieldOptional()
  expiredAt?: string | undefined;

  @UUIDField()
  mainAccId!: Uuid;
}
