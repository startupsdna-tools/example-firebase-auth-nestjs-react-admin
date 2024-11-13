import { useLoginContext } from './LoginContext';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';

export function ForgotForm({ gotoLogin }: { gotoLogin: () => void }) {
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    submitForgot,
    resetPasswordDone,
  } = useLoginContext();
  return (
    <Card
      sx={{
        p: 2,
        width: 320,
      }}
    >
      <CardHeader title="Reset Password" sx={{ pb: 0 }} />
      <CardContent>
        {resetPasswordDone ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset instruction has been sent to your email. Please check
            your inbox.
          </Alert>
        ) : (
          <>
            Password reset instruction will be sent to the following email:
            <form onSubmit={submitForgot}>
              <TextField
                {...register('email', {
                  required: true,
                })}
                error={!!errors.email}
                helperText={errors.email && 'Email is required'}
                label="Email"
                type="email"
                autoComplete="email"
                margin="normal"
                fullWidth
              />
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Send email
              </Button>
            </form>
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" onClick={() => gotoLogin()}>
          Go back
        </Button>
      </CardActions>
    </Card>
  );
}
