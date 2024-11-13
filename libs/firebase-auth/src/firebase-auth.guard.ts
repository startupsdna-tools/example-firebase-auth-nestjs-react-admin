import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAuthService } from './firebase-auth.service';
import { AUTH_PUBLIC, SESSION_COOKIE_NAME } from './firebase-auth.constants';
import { FirebaseAuthRequest } from './firebase-auth.request';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional()
    private readonly authService?: FirebaseAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.authService) {
      return true;
    }

    if (this.isPublicHandler(context)) {
      return true;
    }

    const request: FirebaseAuthRequest = context.switchToHttp().getRequest();

    if (!request.auth) {
      const token = request.cookies[SESSION_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedException();
      }
      request.auth = await this.authService.verifySessionCookie(token);
    }

    return true;
  }

  private isPublicHandler(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(AUTH_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
