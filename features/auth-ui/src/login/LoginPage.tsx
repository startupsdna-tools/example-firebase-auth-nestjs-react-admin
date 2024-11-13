import { useState } from 'react';
import { Loading } from 'react-admin';
import { useQuery } from '@tanstack/react-query';
import { styled, Typography } from '@mui/material';
import { AuthConfig } from '@app/auth';
import { httpClient } from '@app/common-ui';
import { LoginForm } from './LoginForm';
import { ForgotForm } from './ForgotForm';
import { LoginContextProvider } from './LoginContextProvider';

async function fetchConfig() {
  const { data } = await httpClient.get<AuthConfig>('/auth/config');
  return data;
}

export function LoginPage() {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const {
    data: config,
    isLoading,
    isError,
  } = useQuery<AuthConfig>({
    queryKey: ['authConfig'],
    queryFn: fetchConfig,
  });

  if (isLoading) {
    return (
      <Root>
        <Loading loadingPrimary="Loading configuration..." />
      </Root>
    );
  }

  if (isError || !config) {
    return <Root>Failed loading auth config. Please check logs.</Root>;
  }

  return (
    <LoginContextProvider config={config}>
      <Root>
        <Typography variant="subtitle1" color="grey.500" gutterBottom>
          App Tools
        </Typography>
        {view === 'login' && <LoginForm gotoForgot={() => setView('forgot')} />}
        {view === 'forgot' && <ForgotForm gotoLogin={() => setView('login')} />}
      </Root>
    </LoginContextProvider>
  );
}

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  paddingTop: '6em',
});
