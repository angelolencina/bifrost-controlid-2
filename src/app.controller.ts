import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
  ) {}

  @Post('/events')
  saveEvent(@Body() payload: any): void {
    this.eventEmitter.emit(`${payload.event}`, payload);
  }

  @MessagePattern('booking')
  public async execute(@Payload() payload: any) {
    this.eventEmitter.emit(`${payload.event}`, payload);
  }

  @Post('accounts')
  saveAccount(@Body() payload: any) {
    return this.appService.saveAccount(payload);
  }
}
