import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SettingsRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  in_homologation: boolean;
  @IsNotEmpty()
  @IsArray()
  mail_on_homologation: string[];
  @IsOptional()
  @IsArray()
  active_places: string[];
}
