import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MysqlRequestDto } from './mysql-request.dto';
import { SqliteRequestDto } from './sqlite-request.dto';
import { Type } from 'class-transformer';

export class IntegrationRequestDto {
  @IsNotEmpty()
  name: string;
  @IsArray()
  features: string[];
  @IsOptional()
  @ValidateNested()
  @Type(() => MysqlRequestDto)
  mysql: MysqlRequestDto;
  @IsOptional()
  @ValidateNested()
  @Type(() => SqliteRequestDto)
  sqlite: SqliteRequestDto;
}
