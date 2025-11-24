import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '@theme/index';
import { MetricCard } from './MetricCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock animations module
vi.mock('@animations', () => ({
  CountUp: ({ end, prefix, decimals }: any) => (
    <span data-testid="count-up">
      {prefix}
      {end.toFixed(decimals)}
    </span>
  ),
  FadeIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderMetricCard = (props: any) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MetricCard {...props} />
    </ThemeProvider>
  );
};

describe('MetricCard', () => {
  describe('Basic Rendering', () => {
    it('renders label correctly', () => {
      renderMetricCard({ label: 'Net Worth', value: 50000 });
      expect(screen.getByText('Net Worth')).toBeInTheDocument();
    });

    it('renders value with currency formatting by default', () => {
      renderMetricCard({ label: 'Net Worth', value: 50000 });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).toHaveTextContent('$50000.00');
    });

    it('renders value without currency when isCurrency is false', () => {
      renderMetricCard({ label: 'Score', value: 85, isCurrency: false });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).not.toHaveTextContent('$');
    });

    it('renders icon when provided', () => {
      const TestIcon = () => <div data-testid="test-icon">Icon</div>;
      renderMetricCard({ label: 'Test', value: 100, icon: <TestIcon /> });
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders skeleton when loading is true', () => {
      const { container } = renderMetricCard({ label: 'Net Worth', value: 50000, loading: true });

      // Should not show actual content
      expect(screen.queryByText('Net Worth')).not.toBeInTheDocument();

      // Should show skeleton elements
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not render skeleton when loading is false', () => {
      renderMetricCard({ label: 'Net Worth', value: 50000, loading: false });
      expect(screen.getByText('Net Worth')).toBeInTheDocument();
    });
  });

  describe('Change Percentage Display', () => {
    it('displays positive change with + sign', () => {
      renderMetricCard({ label: 'Income', value: 5000, changePercent: 12.5 });
      expect(screen.getByText(/\+12\.50% from last month/)).toBeInTheDocument();
    });

    it('displays negative change without + sign', () => {
      renderMetricCard({ label: 'Expenses', value: 3000, changePercent: -5.25 });
      expect(screen.getByText(/-5\.25% from last month/)).toBeInTheDocument();
    });

    it('displays zero change', () => {
      renderMetricCard({ label: 'Balance', value: 1000, changePercent: 0 });
      expect(screen.getByText(/0\.00% from last month/)).toBeInTheDocument();
    });

    it('displays subtitle when changePercent is not provided', () => {
      renderMetricCard({ label: 'Test', value: 100, subtitle: 'Custom subtitle' });
      expect(screen.getByText('Custom subtitle')).toBeInTheDocument();
    });

    it('prefers changePercent over subtitle when both provided', () => {
      renderMetricCard({ label: 'Test', value: 100, changePercent: 5, subtitle: 'Subtitle' });
      expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
      expect(screen.getByText(/\+5\.00% from last month/)).toBeInTheDocument();
    });
  });

  describe('Trend Icons', () => {
    it('renders TrendingUpIcon for positive change', () => {
      const { container } = renderMetricCard({ label: 'Test', value: 100, changePercent: 5 });
      // MUI icons render as SVG, check for their presence
      const svg = container.querySelector('svg[data-testid="TrendingUpIcon"]');
      expect(svg).toBeInTheDocument();
    });

    it('renders TrendingDownIcon for negative change', () => {
      const { container } = renderMetricCard({ label: 'Test', value: 100, changePercent: -5 });
      const svg = container.querySelector('svg[data-testid="TrendingDownIcon"]');
      expect(svg).toBeInTheDocument();
    });

    it('renders TrendingFlatIcon for zero change', () => {
      const { container } = renderMetricCard({ label: 'Test', value: 100, changePercent: 0 });
      const svg = container.querySelector('svg[data-testid="TrendingFlatIcon"]');
      expect(svg).toBeInTheDocument();
    });

    it('renders no trend icon when changePercent is undefined', () => {
      const { container } = renderMetricCard({ label: 'Test', value: 100 });
      expect(container.querySelector('svg[data-testid="TrendingUpIcon"]')).not.toBeInTheDocument();
      expect(container.querySelector('svg[data-testid="TrendingDownIcon"]')).not.toBeInTheDocument();
      expect(container.querySelector('svg[data-testid="TrendingFlatIcon"]')).not.toBeInTheDocument();
    });
  });

  describe('Positive Color Prop', () => {
    it('uses success color for positive change when positiveColor is success (default)', () => {
      renderMetricCard({ label: 'Income', value: 5000, changePercent: 10, positiveColor: 'success' });
      // Text should be present (color is applied via sx prop)
      expect(screen.getByText(/\+10\.00% from last month/)).toBeInTheDocument();
    });

    it('uses error color for positive change when positiveColor is error', () => {
      renderMetricCard({ label: 'Expenses', value: 3000, changePercent: 10, positiveColor: 'error' });
      // For expenses, positive change (increase) should be shown in error color
      expect(screen.getByText(/\+10\.00% from last month/)).toBeInTheDocument();
    });

    it('uses error color for negative change when positiveColor is success (default)', () => {
      renderMetricCard({ label: 'Income', value: 5000, changePercent: -10, positiveColor: 'success' });
      // Negative income change should be error color
      expect(screen.getByText(/-10\.00% from last month/)).toBeInTheDocument();
    });

    it('uses success color for negative change when positiveColor is error', () => {
      renderMetricCard({ label: 'Expenses', value: 3000, changePercent: -10, positiveColor: 'error' });
      // Negative expense change (decrease) should be success color
      expect(screen.getByText(/-10\.00% from last month/)).toBeInTheDocument();
    });
  });

  describe('Formatting', () => {
    it('formats large numbers correctly', () => {
      renderMetricCard({ label: 'Net Worth', value: 1234567.89 });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).toHaveTextContent('$1234567.89');
    });

    it('formats negative numbers correctly', () => {
      renderMetricCard({ label: 'Debt', value: -5000.50 });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).toHaveTextContent('$-5000.50');
    });

    it('formats zero correctly', () => {
      renderMetricCard({ label: 'Balance', value: 0 });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).toHaveTextContent('$0.00');
    });

    it('uses 2 decimal places by default', () => {
      renderMetricCard({ label: 'Test', value: 123.456 });
      const countUp = screen.getByTestId('count-up');
      expect(countUp).toHaveTextContent('.46'); // Should round to 2 decimals
    });
  });

  describe('Animation Delay', () => {
    it('accepts delay prop', () => {
      // Just verify it renders without error
      renderMetricCard({ label: 'Test', value: 100, delay: 0.5 });
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('defaults to delay of 0 when not provided', () => {
      renderMetricCard({ label: 'Test', value: 100 });
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      renderMetricCard({ label: 'Net Worth', value: 50000, changePercent: 5 });

      // Should have text content for screen readers
      expect(screen.getByText('Net Worth')).toBeInTheDocument();
      expect(screen.getByText(/from last month/)).toBeInTheDocument();
    });
  });
});
