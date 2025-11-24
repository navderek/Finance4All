import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { TopBar } from './TopBar';
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

const renderTopBar = (props = {}) => {
  return render(
    <BrowserRouter>
      <MuiThemeProvider theme={lightTheme}>
        <TopBar {...props} />
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderTopBar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays the page title', () => {
    renderTopBar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows theme toggle button', () => {
    renderTopBar();
    const themeButton = screen.getByLabelText('toggle theme');
    expect(themeButton).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', async () => {
    const user = userEvent.setup();
    renderTopBar();

    const themeButton = screen.getByLabelText('toggle theme');
    await user.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('shows notifications button', () => {
    renderTopBar();
    const notificationsButton = screen.getByLabelText('notifications');
    expect(notificationsButton).toBeInTheDocument();
  });

  it('displays notification badge with count', () => {
    renderTopBar({ notificationCount: 5 });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('navigates to notifications when notifications button is clicked', async () => {
    const user = userEvent.setup();
    renderTopBar();

    const notificationsButton = screen.getByLabelText('notifications');
    await user.click(notificationsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });

  it('shows user avatar button', () => {
    renderTopBar();
    const avatarButton = screen.getByLabelText('account menu');
    expect(avatarButton).toBeInTheDocument();
  });

  it('displays user initial in avatar when no photo', () => {
    renderTopBar();
    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of "Test User"
  });

  it('opens user menu when avatar is clicked', async () => {
    const user = userEvent.setup();
    renderTopBar();

    const avatarButton = screen.getByLabelText('account menu');
    await user.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });


  it('navigates to settings when Settings menu item is clicked', async () => {
    const user = userEvent.setup();
    renderTopBar();

    // Open menu
    const avatarButton = screen.getByLabelText('account menu');
    await user.click(avatarButton);

    // Click Settings
    const settingsMenuItem = await screen.findByText('Settings');
    await user.click(settingsMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('calls logout and navigates to login when Logout is clicked', async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);
    renderTopBar();

    // Open menu
    const avatarButton = screen.getByLabelText('account menu');
    await user.click(avatarButton);

    // Click Logout
    const logoutMenuItem = await screen.findByText('Logout');
    await user.click(logoutMenuItem);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows mobile menu button when showMenuButton is true', () => {
    renderTopBar({ showMenuButton: true });
    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();
  });

  it('does not show mobile menu button when showMenuButton is false', () => {
    renderTopBar({ showMenuButton: false });
    const menuButton = screen.queryByLabelText('open drawer');
    expect(menuButton).not.toBeInTheDocument();
  });

  it('calls onMenuClick when mobile menu button is clicked', async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    renderTopBar({ showMenuButton: true, onMenuClick });

    const menuButton = screen.getByLabelText('open drawer');
    await user.click(menuButton);

    expect(onMenuClick).toHaveBeenCalled();
  });

  it('handles logout error gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLogout.mockRejectedValue(new Error('Logout failed'));
    renderTopBar();

    // Open menu
    const avatarButton = screen.getByLabelText('account menu');
    await user.click(avatarButton);

    // Click Logout
    const logoutMenuItem = await screen.findByText('Logout');
    await user.click(logoutMenuItem);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
