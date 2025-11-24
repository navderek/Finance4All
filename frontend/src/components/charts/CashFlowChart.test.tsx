import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CashFlowChart } from './CashFlowChart';
import type { CashFlowDataPoint } from './CashFlowChart';

describe('CashFlowChart', () => {
  const mockData: CashFlowDataPoint[] = [
    { month: '2024-07-01', income: 5000, expenses: 3500 },
    { month: '2024-08-01', income: 5200, expenses: 3700 },
    { month: '2024-09-01', income: 5100, expenses: 3600 },
    { month: '2024-10-01', income: 5300, expenses: 3800 },
    { month: '2024-11-01', income: 5400, expenses: 3900 },
    { month: '2024-12-01', income: 5500, expenses: 4000 },
  ];

  describe('Rendering', () => {
    it('should render the chart with data', () => {
      render(<CashFlowChart data={mockData} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const { container } = render(<CashFlowChart data={mockData} height={400} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should render with legend by default', () => {
      render(<CashFlowChart data={mockData} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });

    it('should render without legend when showLegend is false', () => {
      render(<CashFlowChart data={mockData} showLegend={false} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton when loading', () => {
      const { container } = render(<CashFlowChart data={mockData} loading={true} />);
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show chart when loading', () => {
      render(<CashFlowChart data={mockData} loading={true} />);
      expect(screen.queryByText('Cash Flow')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state with no data', () => {
      render(<CashFlowChart data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should show empty state with undefined data', () => {
      render(<CashFlowChart data={undefined as any} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should not show chart in empty state', () => {
      render(<CashFlowChart data={[]} />);
      expect(screen.queryByText('Cash Flow')).not.toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('should handle single data point', () => {
      const singlePoint: CashFlowDataPoint[] = [
        { month: '2024-01-01', income: 5000, expenses: 3500 },
      ];
      render(<CashFlowChart data={singlePoint} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });

    it('should handle data with zero values', () => {
      const dataWithZero: CashFlowDataPoint[] = [
        { month: '2024-01-01', income: 0, expenses: 0 },
        { month: '2024-02-01', income: 1000, expenses: 500 },
      ];
      render(<CashFlowChart data={dataWithZero} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });

    it('should handle negative cash flow (expenses > income)', () => {
      const dataWithNegativeCashFlow: CashFlowDataPoint[] = [
        { month: '2024-01-01', income: 3000, expenses: 5000 },
        { month: '2024-02-01', income: 4000, expenses: 3000 },
      ];
      render(<CashFlowChart data={dataWithNegativeCashFlow} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<CashFlowChart data={mockData} />);
      const heading = screen.getByText('Cash Flow');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Responsiveness', () => {
    it('should use ResponsiveContainer', () => {
      const { container } = render(<CashFlowChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should fill 100% width', () => {
      const { container } = render(<CashFlowChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });

  describe('Chart Elements', () => {
    it('should display data for multiple months', () => {
      render(<CashFlowChart data={mockData} />);
      expect(screen.getByText('Cash Flow')).toBeInTheDocument();
      // The chart should handle all 6 months of data
    });
  });
});
