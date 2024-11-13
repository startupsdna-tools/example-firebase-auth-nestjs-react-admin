import { AuthConfig } from '@app/auth';
import { useAuthState } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@app/common-ui';
import { useEffect, useState, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  getFirebaseAuth,
} from './firebase';
import { LoginContext, LoginContextValue, LoginInputs } from './LoginContext';

export function LoginContextProvider(props: {
  config: AuthConfig;
  children: ReactNode;
}) {
  const authState = useAuthState();
  const firebaseAuth = getFirebaseAuth(props.config);
  const navigate = useNavigate();
  const [resetPasswordDone, setResetPasswordDone] = useState(false);

  useEffect(() => {
    if (!authState.isPending && authState.authenticated) {
      redirect();
    }
  }, [authState.isPending, authState.authenticated]);

  const form = useForm<LoginInputs>({
    defaultValues: import.meta.env.PROD
      ? {}
      : {
          email: import.meta.env.VITE_AUTH_EMAIL,
          password: import.meta.env.VITE_AUTH_PASSWORD,
        },
  });

  function redirect() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      navigate(redirect);
    } else {
      navigate('/');
    }
  }

  async function login(idToken: string) {
    return httpClient.post('/auth/login', { idToken }).then(({ data }) => data);
  }

  const submitLogin = form.handleSubmit(async (data) => {
    await signInWithEmailAndPassword(firebaseAuth, data.email, data.password)
      .then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();
        await login(idToken);
        redirect();
      })
      .catch((error) => {
        form.setError('root', { type: error.code, message: error.message });
      });
  });

  const submitForgot = form.handleSubmit(async (data) => {
    await sendPasswordResetEmail(firebaseAuth, data.email)
      .then(async () => {
        form.resetField('email');
        setResetPasswordDone(true);
      })
      .catch((error) => {
        form.setError('root', { type: error.code, message: error.message });
      });
  });

  const loginContext: LoginContextValue = {
    form,
    submitLogin,
    submitForgot,
    resetPasswordDone,
  };

  if (authState.isLoading) {
    return null;
  }

  return (
    <LoginContext.Provider value={loginContext}>
      {props.children}
    </LoginContext.Provider>
  );
}
