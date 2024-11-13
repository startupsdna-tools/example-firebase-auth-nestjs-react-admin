import { Paper } from '@mui/material';
import { Title } from 'react-admin';
import { AccountForm } from './AccountForm';

export function AccountPage() {
  return (
    <Paper
      sx={{
        my: 2,
        width: 400,
      }}
    >
      <Title title="Account Settings" />
      <AccountForm />
    </Paper>
  );
}
