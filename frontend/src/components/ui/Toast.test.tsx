import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Toast, ToastProvider, useToast } from './Toast';
import { lightTheme } from '@theme/index';
import { Button } from './Button';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Toast', () => {
  it('renders when open is true', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Test message" />
      </TestWrapper>
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Toast open={false} onClose={onClose} message="Test message" />
      </TestWrapper>
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('renders with different severity levels', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Success" severity="success" />
      </TestWrapper>
    );
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Toast open onClose={onClose} message="Error" severity="error" />
      </TestWrapper>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Toast open onClose={onClose} message="Warning" severity="warning" />
      </TestWrapper>
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Toast open onClose={onClose} message="Info" severity="info" />
      </TestWrapper>
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('renders with title', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Toast open onClose={onClose} title="Alert Title" message="Alert message" />
      </TestWrapper>
    );

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('shows close button by default', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Closeable toast" />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Non-closeable toast" showCloseButton={false} />
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Test message" />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with custom action', () => {
    const onClose = vi.fn();
    const onAction = vi.fn();

    render(
      <TestWrapper>
        <Toast
          open
          onClose={onClose}
          message="Test message"
          action={<Button onClick={onAction}>Undo</Button>}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('action button is clickable', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onAction = vi.fn();

    render(
      <TestWrapper>
        <Toast
          open
          onClose={onClose}
          message="Test message"
          action={<Button onClick={onAction}>Retry</Button>}
        />
      </TestWrapper>
    );

    await user.click(screen.getByText('Retry'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    const onClose = vi.fn();
    const { container, rerender } = render(
      <TestWrapper>
        <Toast open onClose={onClose} message="Filled" variant="filled" />
      </TestWrapper>
    );
    expect(container.querySelector('.MuiAlert-filled')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Toast open onClose={onClose} message="Outlined" variant="outlined" />
      </TestWrapper>
    );
    expect(container.querySelector('.MuiAlert-outlined')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Toast open onClose={onClose} message="Standard" variant="standard" />
      </TestWrapper>
    );
    expect(container.querySelector('.MuiAlert-standard')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Toast ref={ref} open onClose={onClose} message="Test" />
      </TestWrapper>
    );

    expect(ref).toHaveBeenCalled();
  });
});

describe('ToastProvider and useToast', () => {
  // Helper component to test the hook
  const TestComponent: React.FC<{ onMount?: (toast: ReturnType<typeof useToast>) => void }> = ({
    onMount,
  }) => {
    const toast = useToast();

    React.useEffect(() => {
      if (onMount) {
        onMount(toast);
      }
    }, [onMount, toast]);

    return (
      <div>
        <Button onClick={() => toast.showSuccess('Success message')}>Show Success</Button>
        <Button onClick={() => toast.showError('Error message')}>Show Error</Button>
        <Button onClick={() => toast.showWarning('Warning message')}>Show Warning</Button>
        <Button onClick={() => toast.showInfo('Info message')}>Show Info</Button>
        <Button onClick={() => toast.showToast('Custom toast', { severity: 'success' })}>
          Show Toast
        </Button>
        <Button onClick={() => toast.closeAllToasts()}>Close All</Button>
      </div>
    );
  };

  it('showSuccess displays success toast', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Success'));
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('showError displays error toast', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Error'));
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('showWarning displays warning toast', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Warning'));
    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  it('showInfo displays info toast', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Info'));
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('showToast displays custom toast', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Toast'));
    await waitFor(() => {
      expect(screen.getByText('Custom toast')).toBeInTheDocument();
    });
  });

  it('closes toast when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    await user.click(screen.getByText('Show Success'));
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Get all close buttons and click the one in the alert (not the "Close All" button)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const alertCloseButton = closeButtons.find((btn) => btn.getAttribute('aria-label') === 'Close');
    if (alertCloseButton) {
      await user.click(alertCloseButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('closeAllToasts removes all toasts', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    // Show multiple toasts
    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));
    await user.click(screen.getByText('Show Info'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    // Close all toasts
    await user.click(screen.getByText('Close All'));

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    });
  });

  it('respects maxToasts limit', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ToastProvider maxToasts={2}>
          <TestComponent />
        </ToastProvider>
      </TestWrapper>
    );

    // Show 3 toasts but only last 2 should be visible
    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));
    await user.click(screen.getByText('Show Info'));

    await waitFor(() => {
      // First toast should not be visible (maxToasts=2)
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      // Last 2 toasts should be visible
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
    }).toThrow('useToast must be used within a ToastProvider');

    consoleError.mockRestore();
  });

  it('supports custom options', async () => {
    let toastApi: ReturnType<typeof useToast>;

    render(
      <TestWrapper>
        <ToastProvider>
          <TestComponent
            onMount={(toast) => {
              toastApi = toast;
            }}
          />
        </ToastProvider>
      </TestWrapper>
    );

    await act(async () => {
      toastApi!.showSuccess('Custom options toast', {
        title: 'Success!',
        autoHideDuration: 3000,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Custom options toast')).toBeInTheDocument();
    });
  });
});
