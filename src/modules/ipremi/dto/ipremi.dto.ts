import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class IpremiDto {
  @IsOptional()
  @IsBoolean()
  limitToGroupsDeskbee: boolean;
  @ValidateIf((o) => o.limitToGroupsDeskbee)
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  deskbeeGroupUuids: string[];
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
  @IsNotEmpty()
  @IsNumber()
  campaignId: number;
  @IsNotEmpty()
  @IsString()
  partnerAccessKey: string;
  @IsNotEmpty()
  @IsString()
  url: string;
  @IsNotEmpty()
  @IsString()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsNumber()
  profileId: number;
  @IsNotEmpty()
  @IsNumber()
  enterpriseId: number;
  @IsNotEmpty()
  @IsNumber()
  bankAccountId: number;
  @IsNotEmpty()
  @IsString()
  tokenApi: string;
}
