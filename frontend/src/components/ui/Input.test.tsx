import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { Input } from './Input';
import { lightTheme } from '@theme/index';
import EmailIcon from '@mui/icons-material/Email';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Input', () => {
  it('renders with label', () => {
    render(
      <TestWrapper>
        <Input label="Username" />
      </TestWrapper>
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <TestWrapper>
        <Input placeholder="Enter your email" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <Input label="Name" onChange={onChange} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Name');
    await user.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports different input types', () => {
    const { rerender } = render(
      <TestWrapper>
        <Input label="Email" type="email" />
      </TestWrapper>
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');

    rerender(
      <TestWrapper>
        <Input label="Age" type="number" />
      </TestWrapper>
    );
    expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');

    rerender(
      <TestWrapper>
        <Input label="Password" type="password" />
      </TestWrapper>
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('displays helper text', () => {
    render(
      <TestWrapper>
        <Input label="Email" helperText="Enter a valid email address" />
      </TestWrapper>
    );
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('shows error state with error message', () => {
    render(
      <TestWrapper>
        <Input label="Email" error helperText="Invalid email format" />
      </TestWrapper>
    );

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInvalid();
  });

  it('shows success validation state', () => {
    render(
      <TestWrapper>
        <Input label="Email" validationState="success" />
      </TestWrapper>
    );

    // Check for success icon (CheckCircle)
    const successIcon = document.querySelector('[data-testid="CheckCircleIcon"]');
    expect(successIcon).toBeInTheDocument();
  });

  it('shows warning validation state', () => {
    render(
      <TestWrapper>
        <Input label="Password" validationState="warning" helperText="Weak password" />
      </TestWrapper>
    );

    expect(screen.getByText('Weak password')).toBeInTheDocument();
    const warningIcon = document.querySelector('[data-testid="WarningIcon"]');
    expect(warningIcon).toBeInTheDocument();
  });

  it('renders with start adornment', () => {
    render(
      <TestWrapper>
        <Input label="Email" startAdornment={<EmailIcon data-testid="email-icon" />} />
      </TestWrapper>
    );

    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
  });

  it('renders with end adornment', () => {
    render(
      <TestWrapper>
        <Input
          label="Search"
          endAdornment={<span data-testid="search-icon">🔍</span>}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Input label="Password" type="password" showPasswordToggle />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText('Show password');
    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('disables input when disabled prop is true', () => {
    render(
      <TestWrapper>
        <Input label="Disabled" disabled />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('marks input as required', () => {
    render(
      <TestWrapper>
        <Input label="Required Field" required />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/Required Field/);
    expect(input).toBeRequired();
  });

  it('supports fullWidth prop', () => {
    render(
      <TestWrapper>
        <Input label="Full Width" fullWidth />
      </TestWrapper>
    );

    const inputContainer = screen.getByLabelText('Full Width').closest('.MuiFormControl-root');
    expect(inputContainer).toHaveClass('MuiFormControl-fullWidth');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(
      <TestWrapper>
        <Input label="With Ref" ref={ref} />
      </TestWrapper>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <TestWrapper>
        <Input label="Outlined" variant="outlined" />
      </TestWrapper>
    );
    expect(document.querySelector('.MuiOutlinedInput-root')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Input label="Filled" variant="filled" />
      </TestWrapper>
    );
    expect(document.querySelector('.MuiFilledInput-root')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Input label="Standard" variant="standard" />
      </TestWrapper>
    );
    expect(document.querySelector('.MuiInput-root')).toBeInTheDocument();
  });

  it('has accessible name', () => {
    render(
      <TestWrapper>
        <Input label="Accessible Input" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Accessible Input')).toBeInTheDocument();
  });

  it('supports controlled input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <TestWrapper>
        <Input label="Controlled" value="" onChange={onChange} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Controlled');
    expect(input).toHaveValue('');

    await user.type(input, 'test');
    expect(onChange).toHaveBeenCalled();

    // Simulate parent component updating value
    rerender(
      <TestWrapper>
        <Input label="Controlled" value="test" onChange={onChange} />
      </TestWrapper>
    );

    expect(input).toHaveValue('test');
  });

  it('supports number input with min and max', () => {
    render(
      <TestWrapper>
        <Input label="Age" type="number" inputProps={{ min: 0, max: 120 }} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '120');
  });

  it('shows multiple adornments correctly', () => {
    render(
      <TestWrapper>
        <Input
          label="Password"
          type="password"
          showPasswordToggle
          validationState="success"
          startAdornment={<span data-testid="start">🔒</span>}
        />
      </TestWrapper>
    );

    // Start adornment
    expect(screen.getByTestId('start')).toBeInTheDocument();

    // Success validation icon
    const successIcon = document.querySelector('[data-testid="CheckCircleIcon"]');
    expect(successIcon).toBeInTheDocument();

    // Password toggle
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('prioritizes error state over validation state', () => {
    render(
      <TestWrapper>
        <Input
          label="Email"
          error
          helperText="Required field"
          validationState="success"
        />
      </TestWrapper>
    );

    // Should show error icon, not success icon
    const errorIcon = document.querySelector('[data-testid="ErrorIcon"]');
    expect(errorIcon).toBeInTheDocument();

    const successIcon = document.querySelector('[data-testid="CheckCircleIcon"]');
    expect(successIcon).not.toBeInTheDocument();
  });

  it('supports multiline input', () => {
    render(
      <TestWrapper>
        <Input label="Description" multiline rows={4} />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Description');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });
});
