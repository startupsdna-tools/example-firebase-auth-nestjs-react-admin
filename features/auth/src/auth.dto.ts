import { UserRecord } from 'firebase-admin/auth';

export type AuthConfig = {
  firebase: {
    apiKey: string;
    projectId?: string;
  };
  tenantId?: string;
};

export type AccountDto = UserRecord;

export type AccountUpdateDto = {
  fullName?: string;
  password?: string;
};
