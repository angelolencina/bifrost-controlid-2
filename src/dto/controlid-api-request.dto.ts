import { IsNotEmpty, IsString } from 'class-validator';

export class ControlidApiRequestDto {
  @IsNotEmpty()
  @IsString()
  host: string;
  @IsNotEmpty()
  user: string;
  @IsNotEmpty()
  password: string;
}
