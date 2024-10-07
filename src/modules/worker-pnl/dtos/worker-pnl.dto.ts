import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField, StringFieldOptional } from '../../../decorators';

export class WorkerPnlDto extends AbstractDto {
  @StringField()
  closedPnl!: number;

  @ApiProperty({ type: 'object' })
  @IsObject({ each: true })
  @Type(() => Object)
  pnlDetails!: Record<string, string | number>;

  @StringFieldOptional()
  closingSide?: string | null;
}
