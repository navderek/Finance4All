import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  NetWorthDataPoint,
  CashFlowDataPoint,
  ExpenseCategoryData,
  AccountDistributionData,
} from '@/components/charts';

/**
 * Real-time Dashboard Hook
 *
 * Simulates real-time updates for dashboard data.
 * When backend is ready, this will connect to Firestore listeners.
 *
 * Features:
 * - Simulates periodic updates every 10 seconds
 * - Smooth data transitions
 * - "isLive" indicator for pulse animations
 * - Last update timestamp
 */

export interface DashboardMetrics {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  cashFlow: number;
  netWorthChangePercent: number;
  incomeChangePercent: number;
  expensesChangePercent: number;
  cashFlowChangePercent: number;
}

export interface DashboardChartData {
  netWorth: NetWorthDataPoint[];
  cashFlow: CashFlowDataPoint[];
  expenseBreakdown: ExpenseCategoryData[];
  accountDistribution: AccountDistributionData[];
}

export interface RealtimeDashboardData {
  metrics: DashboardMetrics;
  chartData: DashboardChartData;
  isLive: boolean;
  lastUpdate: Date | null;
  isLoading: boolean;
}

// Generate initial mock data
const generateInitialData = (): {
  metrics: DashboardMetrics;
  chartData: DashboardChartData;
} => {
  const now = new Date();

  // Generate metrics
  const baseNetWorth = 65000;
  const baseIncome = 5200;
  const baseExpenses = 3700;

  const metrics: DashboardMetrics = {
    netWorth: baseNetWorth,
    monthlyIncome: baseIncome,
    monthlyExpenses: baseExpenses,
    cashFlow: baseIncome - baseExpenses,
    netWorthChangePercent: 8.5,
    incomeChangePercent: 3.2,
    expensesChangePercent: -1.5,
    cashFlowChangePercent: 12.3,
  };

  // Generate 12 months of net worth data
  const netWorthData: NetWorthDataPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    netWorthData.push({
      month: date.toISOString(),
      netWorth: 50000 + (11 - i) * 3000 + Math.random() * 2000,
    });
  }

  // Generate 6 months of cash flow data
  const cashFlowData: CashFlowDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    cashFlowData.push({
      month: date.toISOString(),
      income: baseIncome + Math.random() * 500 - 250,
      expenses: baseExpenses + Math.random() * 400 - 200,
    });
  }

  // Generate expense breakdown data
  const expenseBreakdownData: ExpenseCategoryData[] = [
    { category: 'Housing', amount: 1200 },
    { category: 'Food', amount: 600 },
    { category: 'Transportation', amount: 400 },
    { category: 'Entertainment', amount: 300 },
    { category: 'Utilities', amount: 250 },
    { category: 'Healthcare', amount: 200 },
    { category: 'Other', amount: 350 },
  ];

  // Generate account distribution data
  const accountDistributionData: AccountDistributionData[] = [
    { type: 'Checking', assets: 5000, investments: 0, debt: 0 },
    { type: 'Savings', assets: 15000, investments: 0, debt: 0 },
    { type: 'Investment', assets: 0, investments: 45000, debt: 0 },
    { type: 'Credit Card', assets: 0, investments: 0, debt: 2500 },
    { type: 'Loan', assets: 0, investments: 0, debt: 5000 },
  ];

  return {
    metrics,
    chartData: {
      netWorth: netWorthData,
      cashFlow: cashFlowData,
      expenseBreakdown: expenseBreakdownData,
      accountDistribution: accountDistributionData,
    },
  };
};

// Simulate a small update to the data
const simulateUpdate = (
  currentMetrics: DashboardMetrics,
  currentChartData: DashboardChartData
): { metrics: DashboardMetrics; chartData: DashboardChartData } => {
  // Small random changes to metrics (±2%)
  const variation = () => (Math.random() - 0.5) * 0.04;

  const updatedMetrics: DashboardMetrics = {
    netWorth: currentMetrics.netWorth * (1 + variation()),
    monthlyIncome: currentMetrics.monthlyIncome * (1 + variation()),
    monthlyExpenses: currentMetrics.monthlyExpenses * (1 + variation()),
    cashFlow:
      currentMetrics.monthlyIncome * (1 + variation()) -
      currentMetrics.monthlyExpenses * (1 + variation()),
    netWorthChangePercent: currentMetrics.netWorthChangePercent + (Math.random() - 0.5) * 0.5,
    incomeChangePercent: currentMetrics.incomeChangePercent + (Math.random() - 0.5) * 0.3,
    expensesChangePercent: currentMetrics.expensesChangePercent + (Math.random() - 0.5) * 0.3,
    cashFlowChangePercent: currentMetrics.cashFlowChangePercent + (Math.random() - 0.5) * 0.5,
  };

  // Update only the last month of chart data to simulate new data
  const updatedChartData = {
    ...currentChartData,
    netWorth: currentChartData.netWorth.map((point, index) => {
      if (index === currentChartData.netWorth.length - 1) {
        return {
          ...point,
          netWorth: point.netWorth * (1 + variation()),
        };
      }
      return point;
    }),
    cashFlow: currentChartData.cashFlow.map((point, index) => {
      if (index === currentChartData.cashFlow.length - 1) {
        return {
          ...point,
          income: point.income * (1 + variation()),
          expenses: point.expenses * (1 + variation()),
        };
      }
      return point;
    }),
  };

  return {
    metrics: updatedMetrics,
    chartData: updatedChartData,
  };
};

/**
 * Custom hook for real-time dashboard data
 *
 * @param updateInterval - Time in ms between updates (default: 10000ms = 10 seconds)
 * @param enabled - Whether real-time updates are enabled (default: true)
 */
export const useRealtimeDashboard = (
  updateInterval: number = 10000,
  enabled: boolean = true
): RealtimeDashboardData => {
  const [data, setData] = useState<{
    metrics: DashboardMetrics;
    chartData: DashboardChartData;
  }>(generateInitialData);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  const performUpdate = useCallback(() => {
    setIsLive(true);
    const updated = simulateUpdate(data.metrics, data.chartData);
    setData(updated);
    setLastUpdate(new Date());

    // Turn off the "live" indicator after 2 seconds
    setTimeout(() => {
      setIsLive(false);
    }, 2000);
  }, [data]);

  useEffect(() => {
    if (!enabled || isLoading) {
      return;
    }

    // Set up periodic updates
    intervalRef.current = setInterval(performUpdate, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isLoading, updateInterval, performUpdate]);

  return {
    metrics: data.metrics,
    chartData: data.chartData,
    isLive,
    lastUpdate,
    isLoading,
  };
};
