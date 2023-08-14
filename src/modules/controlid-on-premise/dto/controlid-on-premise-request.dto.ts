import {
  IsBoolean,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  ValidateIf,
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
  accessControlByControlidGroup: boolean;
  @IsOptional()
  @IsBoolean()
  limitAccessControlToGroupsDeskbee: boolean;
  @ValidateIf((o) => o.limitAccessControlToGroupsDeskbee)
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  deskbeeGroupUuids: string[];
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
