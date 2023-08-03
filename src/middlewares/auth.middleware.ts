import {
  Injectable,
  NestMiddleware,
  Logger,
  UnauthorizedException,
  RawBodyRequest,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger('AuthMiddleware', { timestamp: true });
  private signature = process.env.SIGNATURE ?? '';
  use(
    request: RawBodyRequest<Request>,
    response: Response,
    next: NextFunction,
  ): void {
    if (
      process.env.NODE_ENV === 'production' &&
      request.originalUrl !== '/health' &&
      request.originalUrl !== '/accounts'
    ) {
      if (!request.headers['x-hub-signature']) {
        throw new UnauthorizedException();
      }
      const hmac = createHmac('SHA256', this.signature);
      const raw: any = request.rawBody;
      const digest = hmac.update(raw).digest('hex');

      if (request.headers['x-hub-signature'] !== digest) {
        this.logger.error('Signature not valid: Unauthorized');
        throw new UnauthorizedException();
      }
      next();
    } else {
      console.log('request.headers', request.headers);
      if (
        request.originalUrl === '/accounts' &&
        !(request.headers['x-signature'] === process.env.SIGNATURE)
      ) {
        throw new UnauthorizedException();
      }
      next();
    }
  }
}
