import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { ContractType } from '../../../constants';

export class GetPairingDto {
  @IsString({ each: true })
  @Type(() => String)
  contractTypes!: ContractType[];
}
