import { PartialType } from '@nestjs/mapped-types';
import { CreateControlidDto } from './create-controlid.dto';

export class UpdateControlidDto extends PartialType(CreateControlidDto) {}
