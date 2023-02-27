import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { LogDto } from './log.dto';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('benf-showcase-service');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const timestamp = new Date().toISOString();
    const url = originalUrl;
    const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
    response.on('close', () => {
      const { statusCode } = response;
      if (url !== '/health' && url !== '/metrics') {
        const loggerTemplate: LogDto = {
          timestamp,
          level: level,
          context: {
            method,
            statusCode,
            originalUrl,
            headers: request?.headers,
          },
          message: 'ok',
          service_name: 'benf-showcase-service',
        };
        if (statusCode < 400) {
          this.logger.verbose(loggerTemplate);
        }
      }
    });
    next();
  }
}
