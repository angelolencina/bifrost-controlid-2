import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post('/events')
  saveEvent(@Body() payload: any): void {
    this.eventEmitter.emit(`${payload.event}`, payload);
  }

  @MessagePattern('booking')
  public async execute(@Payload() payload: any) {
    this.eventEmitter.emit(`${payload.event}`, payload);
  }
}
