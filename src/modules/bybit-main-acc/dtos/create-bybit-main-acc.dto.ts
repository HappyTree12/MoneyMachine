import { BybitMasterDto } from './bybit-master.dto';

export class CreateBybitMainAccDto extends BybitMasterDto {
  accUid?: number;

  expiredAt?: string;

  userId!: Uuid;
}
