import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { StringField } from '../../decorators';

export class CreateWorkerDto {
  @StringField()
  scriptPath!: string;

  @StringField()
  pythonFileName!: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsArray()
  args!: string[];
}
