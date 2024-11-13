import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

export type FirebaseAuthRequest = Request & {
  /**
   * Decoded token for authenticated user
   */
  auth: DecodedIdToken;
};
