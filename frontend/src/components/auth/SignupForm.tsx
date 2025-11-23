import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  Link,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Input, Button } from '@components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { signupSchema, SignupFormData } from '@/validation/authSchemas';
import { FirebaseError } from 'firebase/app';

export interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onLoginClick }) => {
  const { signup, loginWithGoogle, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const getErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      await signup(data.email, data.password, data.displayName);
      onSuccess?.();
    } catch (err) {
      const error = err as FirebaseError;
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
        Create your account
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Get started with Finance4All today
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Full Name"
              type="text"
              autoComplete="name"
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
              fullWidth
              disabled={loading}
            />
          )}
        />

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
              autoComplete="new-password"
              showPasswordToggle
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              disabled={loading}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              showPasswordToggle
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              disabled={loading}
            />
          )}
        />

        <Box>
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I accept the{' '}
                    <Link href="/terms" target="_blank" rel="noopener">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" rel="noopener">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            )}
          />
          {errors.acceptTerms && (
            <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>
          )}
        </Box>

        <Button type="submit" variant="contained" size="large" fullWidth loading={loading}>
          Create Account
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
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onLoginClick}
              sx={{ fontWeight: 600 }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

SignupForm.displayName = 'SignupForm';
