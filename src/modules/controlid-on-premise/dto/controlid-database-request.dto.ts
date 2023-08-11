import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MysqlRequestDto } from './mysql-request.dto';
import { SqliteRequestDto } from '../../../dto/sqlite-request.dto';

export class ControlidDatabaseRequestDto {
  @ValidateIf((o) => !o.sqlite)
  @IsNotEmpty({ message: 'mysql or sqlite is required' })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MysqlRequestDto)
  mysql?: MysqlRequestDto;
  @ValidateIf((o) => !o.mysql)
  @IsNotEmpty({ message: 'mysql or sqlite is required' })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SqliteRequestDto)
  sqlite?: SqliteRequestDto;
}
