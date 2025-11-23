import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Link, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Input, Button } from '@components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/validation/authSchemas';
import { FirebaseError } from 'firebase/app';

export interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignupClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onSignupClick,
}) => {
  const { login, loginWithGoogle, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err) {
      const error = err as FirebaseError;
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      await loginWithGoogle();
      onSuccess?.();
    } catch (err) {
      const error = err as FirebaseError;
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Welcome back
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Sign in to your account to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              disabled={loading}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              type="password"
              autoComplete="current-password"
              showPasswordToggle
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              disabled={loading}
            />
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onForgotPassword}
            sx={{ textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </Box>

        <Button type="submit" variant="contained" size="large" fullWidth loading={loading}>
          Sign In
        </Button>

        <Divider>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          type="button"
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onSignupClick}
              sx={{ fontWeight: 600 }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

LoginForm.displayName = 'LoginForm';
