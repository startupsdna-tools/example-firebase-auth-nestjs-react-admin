import { AuthProvider, UserIdentity } from 'react-admin';
import axios from 'axios';
import { AccountDto } from '@app/auth';

const httpClient = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
  },
});

function getLoginUrl() {
  return '/login' + '?redirect=' + window.location.pathname;
}

let account: AccountDto | null = null;

async function getAccount(force = false): Promise<AccountDto> {
  if (!account || force) {
    account = await httpClient
      .get<AccountDto>('/account')
      .then(({ data }) => data);
  }

  return account as AccountDto;
}

function resetAccount() {
  account = null;
}

export const authProvider: AuthProvider = {
  async login() {
    // nothing to do here
  },

  async logout(): Promise<string | false | void> {
    resetAccount();
    await httpClient.post('/logout').catch(() => null);
  },

  async checkAuth() {
    return getAccount()
      .then(() => Promise.resolve())
      .catch(() => {
        return Promise.reject({
          message: 'You are not authenticated. Please login.',
          logoutUser: false,
          redirectTo: getLoginUrl(),
        });
      });
  },

  async getIdentity(): Promise<UserIdentity> {
    return getAccount().then((account) => {
      return {
        id: account.uid,
        fullName: account.displayName,
        email: account.email,
        avatar: account.photoURL,
      };
    });
  },

  checkError({ status }: { status: number }) {
    if (status === 401) {
      return Promise.reject({
        message: 'Unauthenticated. Please login again.',
        logoutUser: false,
        redirectTo: getLoginUrl(),
      });
    }
    return Promise.resolve();
  },

  async getPermissions() {
    return [];
  },

  async update() {
    await getAccount(true);
  },
};
