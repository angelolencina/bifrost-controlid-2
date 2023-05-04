import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { CreateControlidDto } from './dto/create-controlid.dto';
import { UpdateControlidDto } from './dto/update-controlid.dto';

@Controller('controlid')
export class ControlidController {
  constructor(private readonly controlidService: ControlidService) {}

  @Post()
  create(@Body() createControlidDto: CreateControlidDto) {
    //return this.controlidService.create(createControlidDto);
  }

  @Get()
  findAll() {
    //return this.controlidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.controlidService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateControlidDto: UpdateControlidDto,
  ) {
    //return this.controlidService.update(+id, updateControlidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    ///return this.controlidService.remove(+id);
  }
}
