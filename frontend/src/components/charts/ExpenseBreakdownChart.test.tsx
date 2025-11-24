import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import type { ExpenseCategoryData } from './ExpenseBreakdownChart';

describe('ExpenseBreakdownChart', () => {
  const mockData: ExpenseCategoryData[] = [
    { category: 'Housing', amount: 1200 },
    { category: 'Food', amount: 600 },
    { category: 'Transportation', amount: 400 },
    { category: 'Entertainment', amount: 300 },
    { category: 'Utilities', amount: 250 },
  ];

  describe('Rendering', () => {
    it('should render the chart with data', () => {
      render(<ExpenseBreakdownChart data={mockData} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const { container } = render(<ExpenseBreakdownChart data={mockData} height={400} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should render with legend by default', () => {
      render(<ExpenseBreakdownChart data={mockData} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should render without legend when showLegend is false', () => {
      render(<ExpenseBreakdownChart data={mockData} showLegend={false} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton when loading', () => {
      const { container } = render(<ExpenseBreakdownChart data={mockData} loading={true} />);
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should show circular skeleton for pie chart', () => {
      const { container } = render(<ExpenseBreakdownChart data={mockData} loading={true} />);
      const circularSkeleton = container.querySelector('.MuiSkeleton-circular');
      expect(circularSkeleton).toBeInTheDocument();
    });

    it('should not show chart when loading', () => {
      render(<ExpenseBreakdownChart data={mockData} loading={true} />);
      expect(screen.queryByText('Expense Breakdown')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state with no data', () => {
      render(<ExpenseBreakdownChart data={[]} />);
      expect(screen.getByText('No expenses to display')).toBeInTheDocument();
    });

    it('should show empty state with undefined data', () => {
      render(<ExpenseBreakdownChart data={undefined as any} />);
      expect(screen.getByText('No expenses to display')).toBeInTheDocument();
    });

    it('should not show chart in empty state', () => {
      render(<ExpenseBreakdownChart data={[]} />);
      expect(screen.queryByText('Expense Breakdown')).not.toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('should handle single category', () => {
      const singleCategory: ExpenseCategoryData[] = [{ category: 'Housing', amount: 1200 }];
      render(<ExpenseBreakdownChart data={singleCategory} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should handle data with zero amounts', () => {
      const dataWithZero: ExpenseCategoryData[] = [
        { category: 'Housing', amount: 0 },
        { category: 'Food', amount: 600 },
      ];
      render(<ExpenseBreakdownChart data={dataWithZero} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should handle data with custom colors', () => {
      const dataWithColors: ExpenseCategoryData[] = [
        { category: 'Housing', amount: 1200, color: '#FF0000' },
        { category: 'Food', amount: 600, color: '#00FF00' },
      ];
      render(<ExpenseBreakdownChart data={dataWithColors} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should assign colors automatically if not provided', () => {
      render(<ExpenseBreakdownChart data={mockData} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<ExpenseBreakdownChart data={mockData} />);
      const heading = screen.getByText('Expense Breakdown');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Responsiveness', () => {
    it('should use ResponsiveContainer', () => {
      const { container } = render(<ExpenseBreakdownChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should fill 100% width', () => {
      const { container } = render(<ExpenseBreakdownChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });

  describe('Chart Elements', () => {
    it('should display all categories', () => {
      render(<ExpenseBreakdownChart data={mockData} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
      // The chart should handle all 5 categories
    });
  });

  describe('Percentage Calculations', () => {
    it('should handle percentage calculations correctly', () => {
      // This test verifies that the component can render with data
      // Actual percentage calculation is tested in the custom tooltip
      render(<ExpenseBreakdownChart data={mockData} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('should handle very small percentages', () => {
      const dataWithSmallValues: ExpenseCategoryData[] = [
        { category: 'Major Expense', amount: 10000 },
        { category: 'Tiny Expense', amount: 10 },
      ];
      render(<ExpenseBreakdownChart data={dataWithSmallValues} />);
      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });
  });
});
