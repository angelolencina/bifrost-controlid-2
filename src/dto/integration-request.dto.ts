import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IpremiDto } from '../modules/ipremi/dto/ipremi.dto';
import { ControlidOnPremiseDto } from '../modules/controlid-on-premise/dto/controlid-on-premise-request.dto';
import { ControlidCloudDto } from '../modules/controlid-cloud/dto/controlid-cloud-request.dto';

export class IntegrationRequestDto {
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ControlidOnPremiseDto)
  controlidOnPremise?: ControlidOnPremiseDto;
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ControlidCloudDto)
  controlidCloud?: ControlidCloudDto;
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => IpremiDto)
  iPremi?: IpremiDto;
}
