import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NetWorthChart } from './NetWorthChart';
import type { NetWorthDataPoint } from './NetWorthChart';

describe('NetWorthChart', () => {
  const mockData: NetWorthDataPoint[] = [
    { month: '2024-01-01', netWorth: 50000 },
    { month: '2024-02-01', netWorth: 52000 },
    { month: '2024-03-01', netWorth: 54500 },
    { month: '2024-04-01', netWorth: 53000 },
    { month: '2024-05-01', netWorth: 56000 },
    { month: '2024-06-01', netWorth: 58000 },
    { month: '2024-07-01', netWorth: 60000 },
    { month: '2024-08-01', netWorth: 62000 },
    { month: '2024-09-01', netWorth: 64000 },
    { month: '2024-10-01', netWorth: 63000 },
    { month: '2024-11-01', netWorth: 66000 },
    { month: '2024-12-01', netWorth: 68000 },
  ];

  describe('Rendering', () => {
    it('should render the chart with data', () => {
      render(<NetWorthChart data={mockData} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const { container } = render(<NetWorthChart data={mockData} height={400} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should render with legend when showLegend is true', () => {
      render(<NetWorthChart data={mockData} showLegend={true} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });

    it('should render without legend by default', () => {
      render(<NetWorthChart data={mockData} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton when loading', () => {
      const { container } = render(<NetWorthChart data={mockData} loading={true} />);
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show chart when loading', () => {
      render(<NetWorthChart data={mockData} loading={true} />);
      expect(screen.queryByText('Net Worth Trend')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state with no data', () => {
      render(<NetWorthChart data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should show empty state with undefined data', () => {
      render(<NetWorthChart data={undefined as any} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should not show chart in empty state', () => {
      render(<NetWorthChart data={[]} />);
      expect(screen.queryByText('Net Worth Trend')).not.toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('should handle single data point', () => {
      const singlePoint: NetWorthDataPoint[] = [{ month: '2024-01-01', netWorth: 50000 }];
      render(<NetWorthChart data={singlePoint} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });

    it('should handle data with zero values', () => {
      const dataWithZero: NetWorthDataPoint[] = [
        { month: '2024-01-01', netWorth: 0 },
        { month: '2024-02-01', netWorth: 1000 },
      ];
      render(<NetWorthChart data={dataWithZero} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });

    it('should handle negative net worth values', () => {
      const dataWithNegative: NetWorthDataPoint[] = [
        { month: '2024-01-01', netWorth: -5000 },
        { month: '2024-02-01', netWorth: 1000 },
      ];
      render(<NetWorthChart data={dataWithNegative} />);
      expect(screen.getByText('Net Worth Trend')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<NetWorthChart data={mockData} />);
      const heading = screen.getByText('Net Worth Trend');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Responsiveness', () => {
    it('should use ResponsiveContainer', () => {
      const { container } = render(<NetWorthChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should fill 100% width', () => {
      const { container } = render(<NetWorthChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });
});
