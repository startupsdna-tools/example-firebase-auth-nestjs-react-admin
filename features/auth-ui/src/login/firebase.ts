import { getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { AuthConfig } from '@app/auth';

export * from 'firebase/auth';

export function getFirebaseApp(config: AuthConfig, name?: string) {
  try {
    return getApp(name);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return initializeApp(config.firebase, name);
  }
}

export function getFirebaseAuth(config: AuthConfig) {
  const app = getFirebaseApp(config);
  const auth: Auth = getAuth(app);

  if (config.tenantId) {
    auth.tenantId = config.tenantId;
  }

  return auth;
}
