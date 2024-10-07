import { BooleanField, StringField } from '../../../decorators';

export class BybitMasterDto {
  @StringField()
  readonly apiKey!: string;

  @StringField()
  apiSecret!: string;

  @BooleanField()
  readonly isTestNet!: boolean;
}
