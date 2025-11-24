import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '@theme/index';
import { Dashboard } from './Dashboard';

// Mock Apollo Client
const mockRefetch = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('@apollo/client', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
  gql: vi.fn((strings: TemplateStringsArray) => strings[0]),
}));

// Mock animations
vi.mock('@animations', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock MetricCard
vi.mock('@/components/dashboard', () => ({
  MetricCard: ({ label, value, loading, changePercent }: any) => (
    <div data-testid={`metric-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      {loading ? (
        <div data-testid="loading">Loading...</div>
      ) : (
        <>
          <div data-testid="label">{label}</div>
          <div data-testid="value">${value.toFixed(2)}</div>
          {changePercent !== undefined && (
            <div data-testid="change">{changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%</div>
          )}
        </>
      )}
    </div>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockDashboardData = {
  dashboardSummary: {
    netWorth: {
      current: 50000.00,
      previous: 48000.00,
      changePercent: 4.17,
    },
    monthlyIncome: {
      current: 8000.00,
      previous: 7500.00,
      changePercent: 6.67,
    },
    monthlyExpenses: {
      current: 5000.00,
      previous: 4800.00,
      changePercent: 4.17,
    },
    cashFlow: {
      current: 3000.00,
      previous: 2700.00,
      changePercent: 11.11,
    },
  },
};

const renderDashboard = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Dashboard />
    </ThemeProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetch.mockClear();
  });

  describe('Loading State', () => {
    it('renders loading state when data is being fetched', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      // Should show loading indicators in metric cards
      expect(screen.getAllByTestId('loading')).toHaveLength(4);
    });

    it('displays dashboard title while loading', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Your financial overview at a glance')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('renders all metric cards with data', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      expect(screen.getByTestId('metric-card-net-worth')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-monthly-income')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-monthly-expenses')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-cash-flow')).toBeInTheDocument();
    });

    it('displays correct values for each metric', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      const netWorthCard = screen.getByTestId('metric-card-net-worth');
      expect(netWorthCard).toHaveTextContent('Net Worth');
      expect(netWorthCard).toHaveTextContent('$50000.00');
      expect(netWorthCard).toHaveTextContent('+4.17%');

      const incomeCard = screen.getByTestId('metric-card-monthly-income');
      expect(incomeCard).toHaveTextContent('Monthly Income');
      expect(incomeCard).toHaveTextContent('$8000.00');
      expect(incomeCard).toHaveTextContent('+6.67%');

      const expensesCard = screen.getByTestId('metric-card-monthly-expenses');
      expect(expensesCard).toHaveTextContent('Monthly Expenses');
      expect(expensesCard).toHaveTextContent('$5000.00');
      expect(expensesCard).toHaveTextContent('+4.17%');

      const cashFlowCard = screen.getByTestId('metric-card-cash-flow');
      expect(cashFlowCard).toHaveTextContent('Cash Flow');
      expect(cashFlowCard).toHaveTextContent('$3000.00');
      expect(cashFlowCard).toHaveTextContent('+11.11%');
    });

    it('handles zero values correctly', () => {
      mockUseQuery.mockReturnValue({
        data: {
          dashboardSummary: {
            netWorth: { current: 0, previous: 0, changePercent: 0 },
            monthlyIncome: { current: 0, previous: 0, changePercent: 0 },
            monthlyExpenses: { current: 0, previous: 0, changePercent: 0 },
            cashFlow: { current: 0, previous: 0, changePercent: 0 },
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      const cards = screen.getAllByTestId(/metric-card-/);
      cards.forEach((card) => {
        expect(card).toHaveTextContent('$0.00');
      });
    });

    it('handles negative values correctly', () => {
      mockUseQuery.mockReturnValue({
        data: {
          dashboardSummary: {
            netWorth: { current: -5000, previous: -4000, changePercent: -25 },
            monthlyIncome: { current: 3000, previous: 3500, changePercent: -14.29 },
            monthlyExpenses: { current: 8000, previous: 7500, changePercent: 6.67 },
            cashFlow: { current: -5000, previous: -4000, changePercent: -25 },
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      const netWorthCard = screen.getByTestId('metric-card-net-worth');
      expect(netWorthCard).toHaveTextContent('$-5000.00');
      expect(netWorthCard).toHaveTextContent('-25.00%');
    });
  });

  describe('Error State', () => {
    it('displays error message when query fails', () => {
      const errorMessage = 'Network error: Failed to fetch';
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: new Error(errorMessage),
        refetch: mockRefetch,
      });

      renderDashboard();

      expect(screen.getByText(/Failed to load dashboard data:/)).toBeInTheDocument();
      expect(screen.getByText(errorMessage, { exact: false })).toBeInTheDocument();
    });

    it('displays retry button on error', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: new Error('Test error'),
        refetch: mockRefetch,
      });

      renderDashboard();

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('calls refetch when retry button is clicked', async () => {
      const user = userEvent.setup();
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: new Error('Test error'),
        refetch: mockRefetch,
      });

      renderDashboard();

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('still shows metric cards with default values on error', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: new Error('Test error'),
        refetch: mockRefetch,
      });

      renderDashboard();

      // Metric cards should still be rendered with zero values
      expect(screen.getByTestId('metric-card-net-worth')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-monthly-income')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-monthly-expenses')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-cash-flow')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('renders dashboard header', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Your financial overview at a glance')).toBeInTheDocument();
    });

    it('renders metric cards in correct order', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { container } = renderDashboard();

      const cards = container.querySelectorAll('[data-testid^="metric-card-"]');
      expect(cards[0]).toHaveAttribute('data-testid', 'metric-card-net-worth');
      expect(cards[1]).toHaveAttribute('data-testid', 'metric-card-monthly-income');
      expect(cards[2]).toHaveAttribute('data-testid', 'metric-card-monthly-expenses');
      expect(cards[3]).toHaveAttribute('data-testid', 'metric-card-cash-flow');
    });
  });

  describe('Query Configuration', () => {
    it('calls useQuery with correct query and options', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.any(String), // GraphQL query
        expect.objectContaining({
          fetchPolicy: 'cache-and-network',
          pollInterval: 30000,
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      mockUseQuery.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      renderDashboard();

      const heading = screen.getByRole('heading', { name: 'Dashboard' });
      expect(heading.tagName).toBe('H1');
    });

    it('error alert has proper role', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: new Error('Test error'),
        refetch: mockRefetch,
      });

      renderDashboard();

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });
});
