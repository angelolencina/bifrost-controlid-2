import { Injectable, Logger } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createHmac } from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger('AuthGuard', { timestamp: true });
  private signature: string;

  constructor(
    private readonly reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.signature = this.configService.get<string>('SIGNATURE') || '';
    if (!this.signature) {
      throw new Error('SIGNATURE environment variable is not set.');
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.headers['x-hub-signature'] || !request.rawBody) {
      this.logger.warn('Missing signature or raw body.');
      return false;
    }

    if (
      !this.isValidSignature(
        request.headers['x-hub-signature'],
        request.rawBody,
      )
    ) {
      this.logger.warn('Invalid signature.');
      return false;
    }

    return true;
  }

  private isValidSignature(
    providedSignature: string,
    rawBody: Buffer,
  ): boolean {
    const hmac = createHmac('SHA256', this.signature);
    const digest = hmac.update(rawBody).digest('hex');
    return providedSignature === digest;
  }
}
