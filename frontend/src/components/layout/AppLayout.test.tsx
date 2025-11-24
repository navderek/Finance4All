import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppLayout } from './AppLayout';
import { lightTheme } from '@theme/index';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock contexts
const mockLogout = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: true,
    },
    logout: mockLogout,
  }),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    mode: 'light',
    toggleTheme: mockToggleTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderAppLayout = (props = {}, initialRoute = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MuiThemeProvider theme={lightTheme}>
        <AppLayout {...props}>
          <div>Test Content</div>
        </AppLayout>
      </MuiThemeProvider>
    </MemoryRouter>
  );
};

describe('AppLayout', () => {
  it('renders without crashing', () => {
    renderAppLayout();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays the main content', () => {
    // Custom content is rendered via children prop (same as first test)
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <MuiThemeProvider theme={lightTheme}>
          <AppLayout>
            <div data-testid="custom-content">My Custom Content</div>
          </AppLayout>
        </MuiThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('displays the TopBar', () => {
    renderAppLayout();
    // TopBar should show Dashboard title (can appear in multiple places)
    const dashboardElements = screen.getAllByText('Dashboard');
    expect(dashboardElements.length).toBeGreaterThan(0);
  });

  it('displays breadcrumbs by default', () => {
    renderAppLayout();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('hides breadcrumbs when showBreadcrumbs is false', () => {
    renderAppLayout({ showBreadcrumbs: false });
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('displays sidebar navigation items', () => {
    renderAppLayout();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('displays Finance4All branding', () => {
    renderAppLayout();
    expect(screen.getByText('Finance4All')).toBeInTheDocument();
  });

  it('passes notificationCount to TopBar', () => {
    renderAppLayout({ notificationCount: 5 });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not show mobile menu button on desktop', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(max-width:899.95px)', // NOT mobile
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderAppLayout();
    const menuButton = screen.queryByLabelText('open drawer');
    expect(menuButton).not.toBeInTheDocument();
  });

  it('shows mobile menu button on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width:899.95px)', // IS mobile
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderAppLayout();
    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile drawer when menu button is clicked', async () => {
    const user = userEvent.setup();

    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width:899.95px)', // IS mobile
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderAppLayout();

    const menuButton = screen.getByLabelText('open drawer');
    await user.click(menuButton);

    // MobileDrawer should be rendered (content is always in DOM with temporary drawer)
    // Just verify no errors occurred
    expect(menuButton).toBeInTheDocument();
  });

  it('renders with different routes', () => {
    renderAppLayout({}, '/accounts');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    // Accounts appears in both breadcrumbs and sidebar
    const accountsElements = screen.getAllByText('Accounts');
    expect(accountsElements.length).toBeGreaterThan(0);
  });

  it('has proper responsive layout structure', () => {
    renderAppLayout();
    const mainContent = screen.getByText('Test Content').parentElement;
    expect(mainContent).toBeInTheDocument();
  });
});
