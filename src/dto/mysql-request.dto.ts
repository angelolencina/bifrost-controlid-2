import { IsNotEmpty } from 'class-validator';

export class MysqlRequestDto {
  @IsNotEmpty()
  host: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  database: string;
  @IsNotEmpty()
  port: number;
}
