import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { SignupForm } from './SignupForm';
import { lightTheme } from '@theme/index';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    clearError: vi.fn(),
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('SignupForm', () => {
  it('renders signup form', () => {
    render(
      <TestWrapper>
        <SignupForm />
      </TestWrapper>
    );

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders Google signup button', () => {
    render(
      <TestWrapper>
        <SignupForm />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('renders terms and conditions checkbox', () => {
    render(
      <TestWrapper>
        <SignupForm />
      </TestWrapper>
    );

    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it('renders login link', () => {
    render(
      <TestWrapper>
        <SignupForm />
      </TestWrapper>
    );

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
