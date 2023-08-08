import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ControlidDatabaseRequestDto } from './controlid-database-request.dto';
import { ControlidOnPremiseDto } from './controlid-on-premise-request.dto';

export class IntegrationRequestDto {
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ControlidOnPremiseDto)
  controlidOnPremise?: ControlidOnPremiseDto;
}
