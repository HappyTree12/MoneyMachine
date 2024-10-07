import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanField,
  DateFieldOptional,
  StringField,
  UUIDField,
} from '../../../decorators';
import { type BybitMainAccEntity } from '../bybit-main-acc.entity';

export class BybitMainAccDTO extends AbstractDto {
  // TODO: add encryption for api key and secret
  @ApiPropertyOptional()
  @StringField()
  readonly apiKey!: string;

  @ApiPropertyOptional()
  @BooleanField()
  readonly isTestNet!: boolean;

  @ApiPropertyOptional()
  @DateFieldOptional()
  readonly expiredAt!: Date;

  @ApiPropertyOptional()
  @UUIDField()
  readonly userId!: Uuid;

  constructor(bybitMainAcc: BybitMainAccEntity) {
    super(bybitMainAcc);
    this.apiKey = bybitMainAcc.apiKey;
    this.isTestNet = bybitMainAcc.isTestNet;
    this.expiredAt = bybitMainAcc.expiredAt;
    this.userId = bybitMainAcc.userId;
  }
}
