import { AppOptions, cert } from 'firebase-admin/app';

export type FirebaseConfigOptions = AppOptions & {
  clientEmail?: string;
  privateKey?: string;
};

export function firebaseConfig(options: FirebaseConfigOptions): AppOptions {
  const projectId = options.projectId;
  const credential = options.credential;

  const config: AppOptions = {
    ...options,
  };

  if (credential) {
    config.credential = credential;
  } else if (projectId && options.privateKey && options.clientEmail) {
    config.credential = cert({
      projectId,
      privateKey: options.privateKey,
      clientEmail: options.clientEmail,
    });
  }

  return config;
}
