import { IsNotEmpty, IsString } from 'class-validator';

export class MysqlRequestDto {
  @IsNotEmpty()
  @IsString()
  host: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsString()
  database: string;
  @IsNotEmpty()
  port: number;
}
