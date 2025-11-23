import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { Button } from './Button';
import { lightTheme } from '@theme/index';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Button', () => {
  it('renders with text', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <TestWrapper>
        <Button onClick={onClick}>Click</Button>
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <Button loading>Loading</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(
      <TestWrapper>
        <Button disabled>Disabled</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when loading', () => {
    const onClick = vi.fn();

    render(
      <TestWrapper>
        <Button loading onClick={onClick}>
          Loading
        </Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Disabled buttons have pointer-events: none, which is correct behavior
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button variant="contained">Contained</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-contained');

    rerender(
      <TestWrapper>
        <Button variant="outlined">Outlined</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined');

    rerender(
      <TestWrapper>
        <Button variant="text">Text</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-text');
  });

  it('renders with different colors', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button color="primary">Primary</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-colorPrimary');

    rerender(
      <TestWrapper>
        <Button color="secondary">Secondary</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-colorSecondary');

    rerender(
      <TestWrapper>
        <Button color="error">Error</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-colorError');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button size="small">Small</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeSmall');

    rerender(
      <TestWrapper>
        <Button size="medium">Medium</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeMedium');

    rerender(
      <TestWrapper>
        <Button size="large">Large</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeLarge');
  });

  it('renders with start icon', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;

    render(
      <TestWrapper>
        <Button startIcon={<StartIcon />}>With Icon</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    const EndIcon = () => <span data-testid="end-icon">←</span>;

    render(
      <TestWrapper>
        <Button endIcon={<EndIcon />}>With Icon</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('replaces start icon with spinner when loading', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;

    render(
      <TestWrapper>
        <Button loading startIcon={<StartIcon />}>
          Loading
        </Button>
      </TestWrapper>
    );

    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports fullWidth prop', () => {
    render(
      <TestWrapper>
        <Button fullWidth>Full Width</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveClass('MuiButton-fullWidth');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(
      <TestWrapper>
        <Button ref={ref}>With Ref</Button>
      </TestWrapper>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('has accessible name', () => {
    render(
      <TestWrapper>
        <Button>Accessible Button</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Accessible Button' })).toBeInTheDocument();
  });

  it('supports type attribute', () => {
    render(
      <TestWrapper>
        <Button type="submit">Submit</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
