import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  styled,
} from '@mui/material';
import { forwardRef, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  validationState?: 'success' | 'warning' | 'error';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'validationState',
})<{ validationState?: 'success' | 'warning' | 'error' }>(({ theme, validationState }) => ({
  '& .MuiOutlinedInput-root': {
    ...(validationState === 'success' && {
      '& fieldset': {
        borderColor: theme.palette.success.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.success.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.success.main,
      },
    }),
    ...(validationState === 'warning' && {
      '& fieldset': {
        borderColor: theme.palette.warning.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.warning.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.warning.main,
      },
    }),
  },
  '& .MuiInputLabel-root': {
    ...(validationState === 'success' && {
      color: theme.palette.success.main,
      '&.Mui-focused': {
        color: theme.palette.success.main,
      },
    }),
    ...(validationState === 'warning' && {
      color: theme.palette.warning.main,
      '&.Mui-focused': {
        color: theme.palette.warning.main,
      },
    }),
  },
}));

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      type: initialType = 'text',
      validationState,
      startAdornment,
      endAdornment,
      showPasswordToggle = false,
      error,
      helperText,
      variant = 'outlined',
      InputProps,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = initialType === 'password';
    const type = isPasswordType && showPassword ? 'text' : initialType;

    // Determine if we should show the password toggle
    const shouldShowPasswordToggle = isPasswordType && showPasswordToggle;

    // Get validation icon based on state
    const getValidationIcon = () => {
      if (error) {
        return <ErrorIcon color="error" fontSize="small" />;
      }
      switch (validationState) {
        case 'success':
          return <CheckCircleIcon color="success" fontSize="small" />;
        case 'warning':
          return <WarningIcon color="warning" fontSize="small" />;
        default:
          return null;
      }
    };

    const validationIcon = getValidationIcon();

    // Build the end adornment
    const buildEndAdornment = () => {
      const elements: React.ReactNode[] = [];

      // Add validation icon if present
      if (validationIcon) {
        elements.push(
          <InputAdornment position="end" key="validation-icon">
            {validationIcon}
          </InputAdornment>
        );
      }

      // Add custom end adornment if provided
      if (endAdornment) {
        elements.push(
          <InputAdornment position="end" key="custom-end-adornment">
            {endAdornment}
          </InputAdornment>
        );
      }

      // Add password toggle if applicable
      if (shouldShowPasswordToggle) {
        elements.push(
          <InputAdornment position="end" key="password-toggle">
            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        );
      }

      return elements.length > 0 ? <>{elements}</> : undefined;
    };

    return (
      <StyledTextField
        ref={ref}
        type={type}
        variant={variant}
        error={error}
        helperText={helperText}
        validationState={!error ? validationState : undefined}
        InputProps={{
          ...InputProps,
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: buildEndAdornment(),
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
