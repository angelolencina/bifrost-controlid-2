import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { IntegrationRequestDto } from './integration-request.dto';
import { Type } from 'class-transformer';

export class AccountRequestDto {
  @IsNotEmpty()
  accountCode: string;
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => IntegrationRequestDto)
  integration: IntegrationRequestDto;
}
