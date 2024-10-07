import { IsArray, IsNumber } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NumberField, StringFieldOptional } from '../../../decorators';

export class PhantomDto extends AbstractDto {
  @IsArray()
  @IsNumber({}, { each: true })
  dappPublicKey?: Uint8Array;

  @IsArray()
  @IsNumber({}, { each: true })
  dappSecretKey?: Uint8Array;

  @NumberField()
  chatId!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  sharedSecret?: Uint8Array;

  @StringFieldOptional()
  sessionPublicKey?: string;

  @StringFieldOptional()
  session?: string;
}
