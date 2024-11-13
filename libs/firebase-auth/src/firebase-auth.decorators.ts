import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AUTH_PUBLIC } from './firebase-auth.constants';
import { FirebaseAuthGuard } from './firebase-auth.guard';

/**
 * Decorator to mark a route as public
 * @publicApi
 */
export function AuthPublic() {
  return SetMetadata(AUTH_PUBLIC, true);
}

/**
 * Decorator to set permissions for a route
 * @publicApi
 */
export function UseAuthGuard() {
  return applyDecorators(UseGuards(FirebaseAuthGuard));
}
