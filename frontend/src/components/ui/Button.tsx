/**
 * Button Component
 * Customized button with Gemini design system styling
 */

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { forwardRef } from 'react';

export interface ButtonProps extends Omit<MuiButtonProps, 'endIcon' | 'startIcon'> {
  /**
   * If true, shows a loading spinner and disables the button
   */
  loading?: boolean;
  /**
   * Icon to display at the start of the button
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the button
   */
  endIcon?: React.ReactNode;
}

/**
 * Button component with loading state support
 *
 * @example
 * ```tsx
 * <Button variant="contained" color="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button loading variant="contained">
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, disabled, children, startIcon, endIcon, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <MuiButton
        ref={ref}
        disabled={isDisabled}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
        endIcon={!loading ? endIcon : undefined}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
