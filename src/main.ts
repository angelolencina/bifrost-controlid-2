import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const configService = app.get(ConfigService);
  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const queueName = configService.get('RABBITMQ_QUEUE_NAME');
 
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      queueOptions: {
        durable: true,
      },
      socketOptions:{
        heartbeatIntervalInSeconds:5,
        reconnectTimeInSeconds:5
    }
    },
  });
 
  app.startAllMicroservices();
  await app.listen(port, () => {
    Logger.log(`Server started at port:${port}`);
  });
}
bootstrap();
