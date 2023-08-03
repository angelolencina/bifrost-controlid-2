import { IsNotEmpty } from 'class-validator';

export class SqliteRequestDto {
  @IsNotEmpty()
  path: string;
}
