import { createContext, useContext } from 'react';
import { UseFormReturn, UseFormHandleSubmit } from 'react-hook-form';

export type LoginInputs = {
  email: string;
  password: string;
};

export type LoginContextValue = {
  form: UseFormReturn<LoginInputs>;
  submitLogin: ReturnType<UseFormHandleSubmit<LoginInputs>>;
  submitForgot: ReturnType<UseFormHandleSubmit<LoginInputs>>;
  resetPasswordDone: boolean;
};

export const LoginContext = createContext<LoginContextValue | null>(null);

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error(
      'useLoginContext must be used within a LoginContext.Provider',
    );
  }
  return context;
}
