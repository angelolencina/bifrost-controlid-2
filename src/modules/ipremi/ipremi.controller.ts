import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { Public } from '../../decorators/is-public.decorator';

@Controller('ipremi')
export class IpremiController {
  constructor() {}

  @Public()
  @Get()
  @Redirect('https://app.deskbee.app', 302)
  redirect(@Query('user-uuid') userUuid: string) {
    return {
      url: `https://deskbee.ipremi.com.br/login/fromexternalapplication?token=`,
    };
  }
}
