import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import {
  NumberField,
  NumberFieldOptional,
  UUIDField,
} from '../../../decorators';

export class CreateGroupOrderDto {
  @NumberField()
  priceEntryDiffPercentage!: number;

  category?: string;

  symbol?: string;

  @NumberFieldOptional()
  initialCapital?: number;

  @NumberFieldOptional()
  minCapital?: number;

  @NumberFieldOptional()
  maxCapital?: number;

  @UUIDField()
  masterWorkerId!: Uuid;

  @ApiProperty({
    isArray: true,
  })
  @IsArray()
  bybitSubAccIds!: Uuid[];
}
