import { FirebaseError } from 'firebase-admin';
import { UnauthorizedException } from '@nestjs/common';

export function isFirebaseError(e: unknown): e is FirebaseError {
  return e !== null && typeof e === 'object' && 'code' in e && 'message' in e;
}

export function firebaseErrorToNestException(e: unknown) {
  if (!isFirebaseError(e)) {
    return e;
  }

  const { code, message } = e;
  switch (code) {
    case 'auth/invalid-id-token':
    case 'auth/id-token-expired':
    case 'auth/id-token-revoked':
    case 'auth/session-cookie-expired':
    case 'auth/session-cookie-revoked':
    case 'auth/user-not-found':
      return new UnauthorizedException(message);
  }

  return e;
}

export function catchFirebaseError(e: unknown): never {
  throw firebaseErrorToNestException(e);
}
