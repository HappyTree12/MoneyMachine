import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanField,
  DateField,
  StringField,
  UUIDField,
} from '../../../decorators';
import { type BybitSubAccEntity } from '../bybit-sub-acc.entity';

export class BybitSubAccDTO extends AbstractDto {
  @ApiPropertyOptional()
  @StringField()
  readonly apiKey!: string;

  @ApiPropertyOptional()
  @BooleanField()
  readonly isTestNet!: boolean;

  @ApiPropertyOptional()
  @UUIDField()
  readonly accUid!: number;

  @ApiPropertyOptional()
  @StringField()
  readonly accountName!: string;

  @ApiPropertyOptional()
  @DateField()
  readonly expiredAt!: Date;

  @ApiPropertyOptional()
  @UUIDField()
  readonly mainAccId!: Uuid;

  constructor(bybit: BybitSubAccEntity) {
    super(bybit);
    this.apiKey = bybit.apiKey;
    // this.apiSecret = bybit.apiSecret;
    this.isTestNet = bybit.isTestNet;
    this.accUid = bybit.accUid;
    this.accountName = bybit.accountName;
    this.expiredAt = bybit.expiredAt;
    this.mainAccId = bybit.mainAccId;
  }
}
