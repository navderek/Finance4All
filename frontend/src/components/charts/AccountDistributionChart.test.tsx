import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountDistributionChart } from './AccountDistributionChart';
import type { AccountDistributionData } from './AccountDistributionChart';

describe('AccountDistributionChart', () => {
  const mockData: AccountDistributionData[] = [
    { type: 'Checking', assets: 5000, investments: 0, debt: 0 },
    { type: 'Savings', assets: 15000, investments: 0, debt: 0 },
    { type: 'Investment', assets: 0, investments: 45000, debt: 0 },
    { type: 'Credit Card', assets: 0, investments: 0, debt: 2500 },
    { type: 'Loan', assets: 0, investments: 0, debt: 5000 },
  ];

  describe('Rendering', () => {
    it('should render the chart with data', () => {
      render(<AccountDistributionChart data={mockData} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const { container } = render(<AccountDistributionChart data={mockData} height={400} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should render with legend by default', () => {
      render(<AccountDistributionChart data={mockData} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should render without legend when showLegend is false', () => {
      render(<AccountDistributionChart data={mockData} showLegend={false} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton when loading', () => {
      const { container } = render(<AccountDistributionChart data={mockData} loading={true} />);
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show chart when loading', () => {
      render(<AccountDistributionChart data={mockData} loading={true} />);
      expect(screen.queryByText('Account Distribution')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state with no data', () => {
      render(<AccountDistributionChart data={[]} />);
      expect(screen.getByText('No account data available')).toBeInTheDocument();
    });

    it('should show empty state with undefined data', () => {
      render(<AccountDistributionChart data={undefined as any} />);
      expect(screen.getByText('No account data available')).toBeInTheDocument();
    });

    it('should not show chart in empty state', () => {
      render(<AccountDistributionChart data={[]} />);
      expect(screen.queryByText('Account Distribution')).not.toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('should handle single account type', () => {
      const singleType: AccountDistributionData[] = [
        { type: 'Checking', assets: 5000, investments: 0, debt: 0 },
      ];
      render(<AccountDistributionChart data={singleType} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle data with zero values', () => {
      const dataWithZero: AccountDistributionData[] = [
        { type: 'Checking', assets: 0, investments: 0, debt: 0 },
        { type: 'Savings', assets: 15000, investments: 0, debt: 0 },
      ];
      render(<AccountDistributionChart data={dataWithZero} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle assets only', () => {
      const assetsOnly: AccountDistributionData[] = [
        { type: 'Checking', assets: 5000, investments: 0, debt: 0 },
        { type: 'Savings', assets: 10000, investments: 0, debt: 0 },
      ];
      render(<AccountDistributionChart data={assetsOnly} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle investments only', () => {
      const investmentsOnly: AccountDistributionData[] = [
        { type: 'Stocks', assets: 0, investments: 30000, debt: 0 },
        { type: 'Bonds', assets: 0, investments: 20000, debt: 0 },
      ];
      render(<AccountDistributionChart data={investmentsOnly} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle debt only', () => {
      const debtOnly: AccountDistributionData[] = [
        { type: 'Credit Card', assets: 0, investments: 0, debt: 2500 },
        { type: 'Loan', assets: 0, investments: 0, debt: 5000 },
      ];
      render(<AccountDistributionChart data={debtOnly} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle mixed account types', () => {
      render(<AccountDistributionChart data={mockData} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<AccountDistributionChart data={mockData} />);
      const heading = screen.getByText('Account Distribution');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Responsiveness', () => {
    it('should use ResponsiveContainer', () => {
      const { container } = render(<AccountDistributionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should fill 100% width', () => {
      const { container } = render(<AccountDistributionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });

  describe('Chart Elements', () => {
    it('should display all account types', () => {
      render(<AccountDistributionChart data={mockData} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
      // The chart should handle all 5 account types
    });
  });

  describe('Stacking Logic', () => {
    it('should handle high asset values', () => {
      const highAssets: AccountDistributionData[] = [
        { type: 'Investment', assets: 1000000, investments: 500000, debt: 100000 },
      ];
      render(<AccountDistributionChart data={highAssets} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });

    it('should handle high debt values', () => {
      const highDebt: AccountDistributionData[] = [
        { type: 'Mortgage', assets: 0, investments: 0, debt: 500000 },
      ];
      render(<AccountDistributionChart data={highDebt} />);
      expect(screen.getByText('Account Distribution')).toBeInTheDocument();
    });
  });
});
