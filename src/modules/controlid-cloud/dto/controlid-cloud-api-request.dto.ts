import { IsNotEmpty, IsString } from 'class-validator';

export class ControlidCloudApiRequestDto {
  @IsNotEmpty()
  @IsString()
  host: string;
  @IsNotEmpty()
  user: string;
  @IsNotEmpty()
  password: string;
}
