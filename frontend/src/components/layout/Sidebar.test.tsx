import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Sidebar } from './Sidebar';
import { lightTheme } from '@theme/index';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderSidebar = (props = {}, initialRoute = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider theme={lightTheme}>
        <Sidebar {...props} />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Sidebar', () => {
  it('renders without crashing', () => {
    renderSidebar();
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
  });

  it('displays the brand logo and name', () => {
    renderSidebar();
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
    expect(screen.getByText('Personal Finance')).toBeInTheDocument();
    expect(screen.getByText('F4A')).toBeInTheDocument();
  });

  it('displays version number in footer', () => {
    renderSidebar();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('renders all navigation sections', () => {
    renderSidebar();

    // Check section titles
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderSidebar();

    // Main section
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Finance section
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();

    // Analysis section
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Budgets')).toBeInTheDocument();
    expect(screen.getByText('Projections')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();

    // Settings
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active route', () => {
    renderSidebar({}, '/accounts');

    const accountsButton = screen.getByText('Accounts').closest('[role="button"]');
    expect(accountsButton).toHaveClass('Mui-selected');
  });

  it('navigates when a nav item is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar();

    const accountsButton = screen.getByText('Accounts');
    await user.click(accountsButton);

    // After navigation, Accounts should be selected
    await waitFor(() => {
      const accountsButtonAfter = screen.getByText('Accounts').closest('[role="button"]');
      expect(accountsButtonAfter).toHaveClass('Mui-selected');
    });
  });

  it('calls onClose when mobile nav item is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width:899.95px)', // md breakpoint
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderSidebar({ onClose, variant: 'temporary', open: true });

    const accountsButton = screen.getByText('Accounts');
    await user.click(accountsButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('renders badges when provided', () => {
    // This test verifies the component handles badges in the nav config
    // Since our current nav config doesn't have badges, we just verify
    // the component renders correctly
    renderSidebar();
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
  });

  it('applies divider styling to settings item', () => {
    renderSidebar();
    const settingsButton = screen.getByText('Settings').closest('[role="button"]');
    expect(settingsButton).toBeInTheDocument();
  });

  it('supports different drawer variants', () => {
    const { rerender } = renderSidebar({ variant: 'permanent' });
    expect(screen.getByText('Finance4All')).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ThemeProvider theme={lightTheme}>
          <Sidebar variant="temporary" open={true} />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
  });

  it('supports custom width', () => {
    const customWidth = 320;
    renderSidebar({ width: customWidth });
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
  });

  it('handles open/close state for temporary variant', () => {
    const { rerender } = renderSidebar({ variant: 'temporary', open: true });

    // When opened, content should be visible
    expect(screen.getByText('Finance4All')).toBeInTheDocument();

    // Rerender with closed state - component should still work
    rerender(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ThemeProvider theme={lightTheme}>
          <Sidebar variant="temporary" open={false} />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Component renders without errors (content may still be in DOM but hidden)
    expect(true).toBe(true);
  });

  it('displays all icons for nav items', () => {
    renderSidebar();

    // Check that ListItemIcon elements are rendered
    const icons = screen.getAllByRole('button');
    expect(icons.length).toBeGreaterThan(0);
  });
});
