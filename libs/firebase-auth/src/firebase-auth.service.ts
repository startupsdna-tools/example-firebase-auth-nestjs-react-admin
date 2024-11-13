import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAuthOptions } from './firebase-auth.dto';
import { FIREBASE_AUTH_OPTIONS } from './firebase-auth.constants';
import {
  Auth,
  SessionCookieOptions,
  TenantAwareAuth,
  UpdateRequest,
} from 'firebase-admin/auth';
import { catchFirebaseError } from './firebase-auth.utils';

@Injectable()
export class FirebaseAuthService {
  private readonly auth: Auth | TenantAwareAuth;

  constructor(
    @Inject(FIREBASE_AUTH_OPTIONS) private options: FirebaseAuthOptions,
    firebaseAuth: Auth,
  ) {
    this.auth = this.options.tenantId
      ? firebaseAuth.tenantManager().authForTenant(this.options.tenantId)
      : firebaseAuth;
  }

  async createSessionCookie(idToken: string, options: SessionCookieOptions) {
    return this.auth
      .createSessionCookie(idToken, options)
      .catch(catchFirebaseError);
  }

  async verifySessionCookie(cookie: string, checkRevoked = false) {
    return this.auth
      .verifySessionCookie(cookie, checkRevoked)
      .catch(catchFirebaseError);
  }

  async getUser(uid: string) {
    return this.auth.getUser(uid).catch(catchFirebaseError);
  }

  async updateUser(uid: string, properties: UpdateRequest) {
    return this.auth.updateUser(uid, properties).catch(catchFirebaseError);
  }
}
