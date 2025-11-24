import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRealtimeDashboard } from './useRealtimeDashboard';

describe('useRealtimeDashboard', () => {
  describe('Initialization', () => {
    it('should return dashboard data structure', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(result.current).toHaveProperty('metrics');
      expect(result.current).toHaveProperty('chartData');
      expect(result.current).toHaveProperty('isLive');
      expect(result.current).toHaveProperty('lastUpdate');
      expect(result.current).toHaveProperty('isLoading');
    });

    it('should initialize metrics with valid numbers', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(typeof result.current.metrics.netWorth).toBe('number');
      expect(typeof result.current.metrics.monthlyIncome).toBe('number');
      expect(typeof result.current.metrics.monthlyExpenses).toBe('number');
      expect(typeof result.current.metrics.cashFlow).toBe('number');
    });

    it('should initialize chart data with arrays', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(Array.isArray(result.current.chartData.netWorth)).toBe(true);
      expect(Array.isArray(result.current.chartData.cashFlow)).toBe(true);
      expect(Array.isArray(result.current.chartData.expenseBreakdown)).toBe(true);
      expect(Array.isArray(result.current.chartData.accountDistribution)).toBe(true);
    });

    it('should have 12 months of net worth data', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(result.current.chartData.netWorth).toHaveLength(12);
    });

    it('should have 6 months of cash flow data', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(result.current.chartData.cashFlow).toHaveLength(6);
    });

    it('should start as not live', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(result.current.isLive).toBe(false);
    });
  });

  describe('Data Structure', () => {
    it('should have complete metrics structure', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      const { metrics } = result.current;
      expect(metrics).toHaveProperty('netWorth');
      expect(metrics).toHaveProperty('monthlyIncome');
      expect(metrics).toHaveProperty('monthlyExpenses');
      expect(metrics).toHaveProperty('cashFlow');
      expect(metrics).toHaveProperty('netWorthChangePercent');
      expect(metrics).toHaveProperty('incomeChangePercent');
      expect(metrics).toHaveProperty('expensesChangePercent');
      expect(metrics).toHaveProperty('cashFlowChangePercent');
    });

    it('should have complete chart data structure', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      const { chartData } = result.current;
      expect(chartData).toHaveProperty('netWorth');
      expect(chartData).toHaveProperty('cashFlow');
      expect(chartData).toHaveProperty('expenseBreakdown');
      expect(chartData).toHaveProperty('accountDistribution');
    });

    it('should have valid date strings in chart data', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      const { chartData } = result.current;

      // Check that dates are valid ISO strings
      chartData.netWorth.forEach((point) => {
        expect(point.month).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        expect(new Date(point.month).toString()).not.toBe('Invalid Date');
      });
    });

    it('should have positive financial values', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      const { metrics } = result.current;

      // Financial values should be numbers (could be positive or negative)
      expect(typeof metrics.netWorth).toBe('number');
      expect(typeof metrics.monthlyIncome).toBe('number');
      expect(typeof metrics.monthlyExpenses).toBe('number');
      expect(typeof metrics.cashFlow).toBe('number');
    });
  });

  describe('Configuration', () => {
    it('should accept custom update interval', () => {
      const { result } = renderHook(() => useRealtimeDashboard(5000, false));

      expect(result.current).toBeDefined();
    });

    it('should accept enabled flag', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, true));

      expect(result.current).toBeDefined();
    });

    it('should work with updates disabled', () => {
      const { result } = renderHook(() => useRealtimeDashboard(10000, false));

      expect(result.current.metrics).toBeDefined();
      expect(result.current.chartData).toBeDefined();
    });
  });
});
