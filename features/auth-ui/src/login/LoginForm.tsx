import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import { useLoginContext } from './LoginContext';

export function LoginForm({ gotoForgot }: { gotoForgot: () => void }) {
  const {
    submitLogin,
    form: {
      register,
      formState: { isSubmitting, errors },
    },
  } = useLoginContext();

  const firebaseErrorType: Record<string | number, string> = {
    'auth/wrong-password': 'Wrong password',
    'auth/user-not-found': 'Email address does not exists',
  };

  return (
    <Card
      sx={{
        p: 2,
        width: 320,
      }}
    >
      <CardHeader title="Sign In" sx={{ pb: 0 }} />
      <CardContent>
        <form onSubmit={submitLogin}>
          <TextField
            {...register('email', {
              required: true,
            })}
            error={!!errors.email}
            helperText={errors.email && 'Email is required'}
            label="Email"
            type="email"
            autoFocus
            autoComplete="email"
            margin="normal"
            fullWidth
          />
          <TextField
            {...register('password', {
              required: true,
            })}
            error={!!errors.password}
            helperText={errors.password && 'Password is required'}
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            fullWidth
          />
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
          {errors.root?.type && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {firebaseErrorType[errors.root.type] || errors.root.type}
            </Alert>
          )}
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" onClick={() => gotoForgot()}>
          Forgot password?
        </Button>
      </CardActions>
    </Card>
  );
}
