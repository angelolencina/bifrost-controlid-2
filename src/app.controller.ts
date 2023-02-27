import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/events')
  saveEvent(@Body() payload: any): void {
    this.eventEmitter.emit(`${payload.event}`, payload);
  }
}
