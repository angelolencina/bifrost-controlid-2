import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IpremiDto {
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
