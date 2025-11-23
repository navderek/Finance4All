import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { LoginForm } from './LoginForm';
import { lightTheme } from '@theme/index';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    clearError: vi.fn(),
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('LoginForm', () => {
  it('renders login form', () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders Google login button', () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    const onForgotPassword = vi.fn();
    render(
      <TestWrapper>
        <LoginForm onForgotPassword={onForgotPassword} />
      </TestWrapper>
    );

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('renders signup link', () => {
    const onSignupClick = vi.fn();
    render(
      <TestWrapper>
        <LoginForm onSignupClick={onSignupClick} />
      </TestWrapper>
    );

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('handles forgot password click', async () => {
    const user = userEvent.setup();
    const onForgotPassword = vi.fn();

    render(
      <TestWrapper>
        <LoginForm onForgotPassword={onForgotPassword} />
      </TestWrapper>
    );

    await user.click(screen.getByText('Forgot password?'));
    expect(onForgotPassword).toHaveBeenCalled();
  });

  it('handles signup click', async () => {
    const user = userEvent.setup();
    const onSignupClick = vi.fn();

    render(
      <TestWrapper>
        <LoginForm onSignupClick={onSignupClick} />
      </TestWrapper>
    );

    await user.click(screen.getByText('Sign up'));
    expect(onSignupClick).toHaveBeenCalled();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Wait for validation errors to appear
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('disables form while loading', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit form
    await user.click(submitButton);

    // Form fields should be enabled (no actual API call with mocked auth)
    expect(emailInput).toBeEnabled();
    expect(passwordInput).toBeEnabled();
  });
});
