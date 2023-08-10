import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IntegrationRequestDto } from './integration-request.dto';
import { Type } from 'class-transformer';

export class AccountRequestDto {
  @IsOptional()
  accountCode: string;
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => IntegrationRequestDto)
  integration: IntegrationRequestDto;
}
