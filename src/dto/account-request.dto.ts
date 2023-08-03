import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { IntegrationRequestDto } from './integration-request.dto';
import { Type } from 'class-transformer';
import { SettingsRequestDto } from './settings-request.dto';

export class AccountRequestDto {
  @IsNotEmpty()
  code: string;
  @IsArray()
  @ValidateNested()
  @Type(() => IntegrationRequestDto)
  integration: IntegrationRequestDto[];
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SettingsRequestDto)
  settings: SettingsRequestDto;
}
