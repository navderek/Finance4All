import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Link, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Input, Button } from '@components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { passwordResetSchema, PasswordResetFormData } from '@/validation/authSchemas';
import { FirebaseError } from 'firebase/app';

export interface PasswordResetFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSuccess,
  onBackToLogin,
}) => {
  const { resetPassword, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const getErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      clearError();
      await resetPassword(data.email);
      setSuccess(true);
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
      <Box sx={{ mb: 2 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onBackToLogin}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to login
        </Link>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Reset your password
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Enter your email address and we'll send you instructions to reset your password
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset email sent! Check your inbox for instructions.
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
              disabled={loading || success}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={loading}
          disabled={success}
        >
          {success ? 'Email Sent' : 'Send Reset Link'}
        </Button>

        {success && (
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Didn't receive the email?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                sx={{ fontWeight: 600 }}
              >
                Try again
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

PasswordResetForm.displayName = 'PasswordResetForm';
