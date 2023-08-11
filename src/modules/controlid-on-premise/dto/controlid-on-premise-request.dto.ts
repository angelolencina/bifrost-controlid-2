import {
  IsBoolean,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ControlidDatabaseRequestDto } from './controlid-database-request.dto';
import { Type } from 'class-transformer';
import { ControlidApiRequestDto } from './controlid-api-request.dto';

export class ControlidOnPremiseDto {
  @IsNotEmpty()
  @IsBoolean()
  accessControlByLimit: boolean;
  @IsOptional()
  @IsBoolean()
  accessControlByGroup: boolean;
  @IsNotEmpty()
  @IsBoolean()
  automatedCheckIn: boolean;
  @IsNotEmpty()
  @IsBoolean()
  genQrCode: boolean;
  @IsNotEmpty()
  @IsBoolean()
  userRegistration: boolean;
  @IsNotEmpty()
  @IsBoolean()
  inHomologation: boolean;
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  deskbeeExcludedGroups: string[];
  @IsNotEmpty()
  mailsExcluded: string[];
  @IsNotEmpty()
  @IsArray()
  mailsInHomologation: string[];
  @IsNotEmpty()
  @IsArray()
  activePlaces: string[];
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ControlidDatabaseRequestDto)
  database: ControlidDatabaseRequestDto;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ControlidApiRequestDto)
  api: ControlidApiRequestDto;
}
