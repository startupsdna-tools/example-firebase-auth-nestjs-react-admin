import {
  PasswordInput,
  SaveContextProvider,
  SaveContextValue,
  SimpleForm,
  TextInput,
  useAuthProvider,
  useGetIdentity,
  useNotify,
} from 'react-admin';
import { TextField } from '@mui/material';
import { AccountUpdateDto } from '@app/auth';

export function AccountForm() {
  const authProvider = useAuthProvider();
  const { data: account, refetch } = useGetIdentity();
  const notify = useNotify();
  const formValues: AccountUpdateDto = {
    fullName: account?.fullName || '',
  };
  const saveContext: SaveContextValue = {
    save: async (data: AccountUpdateDto) => {
      await authProvider?.update(data);
      if (refetch) refetch();
      notify('Account settings have been successfully updated', {
        type: 'success',
      });
    },
  };

  return (
    <SaveContextProvider value={saveContext}>
      <SimpleForm values={formValues}>
        <TextField
          label="Email"
          helperText={' '}
          value={account?.email || ''}
          disabled
          fullWidth
        />
        <TextInput source="fullName" label="Full Name" fullWidth />
        <PasswordInput source="password" label="New Password" fullWidth />
      </SimpleForm>
    </SaveContextProvider>
  );
}
