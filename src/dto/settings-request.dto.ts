import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SettingsRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  inHomologation: boolean;
  @IsNotEmpty()
  @IsArray()
  mailOnHomologation: string[];
  @IsOptional()
  @IsArray()
  activePlaces: string[];
}
