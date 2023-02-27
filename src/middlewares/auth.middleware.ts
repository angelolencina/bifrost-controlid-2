import {
  Injectable,
  NestMiddleware,
  Logger,
  UnauthorizedException,
  RawBodyRequest,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const { createHmac } = require('node:crypto');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger('AuthMiddleware', { timestamp: true });

  use(
    request: RawBodyRequest<Request>,
    response: Response,
    next: NextFunction,
  ): void {
    if (process.env.NODE_ENV === 'production') {
      const hmac = createHmac('SHA256', process.env.SIGNATURE).setEncoding(
        'hex',
      );
      // if (request.headers['x-hub-signature'] !== hmac.update(request.rawBody).digest('hex')) {
      //   this.logger.error('Signature not valid: Unauthorized');
      //    throw new UnauthorizedException();
      // }
    }
    next();
  }
}
