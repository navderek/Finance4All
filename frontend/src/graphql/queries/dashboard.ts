import { gql } from '@apollo/client';

/**
 * Dashboard GraphQL Queries
 *
 * Queries for fetching dashboard metrics and summary data
 */

/**
 * Dashboard Summary Query
 *
 * Fetches all key financial metrics for the dashboard:
 * - Current net worth
 * - Monthly income
 * - Monthly expenses
 * - Cash flow (income - expenses)
 * - Change percentages from previous period
 */
export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary {
    dashboardSummary {
      netWorth {
        current
        previous
        changePercent
      }
      monthlyIncome {
        current
        previous
        changePercent
      }
      monthlyExpenses {
        current
        previous
        changePercent
      }
      cashFlow {
        current
        previous
        changePercent
      }
    }
  }
`;

/**
 * TypeScript types for dashboard queries
 */

export interface MetricData {
  current: number;
  previous: number;
  changePercent: number;
}

export interface DashboardSummary {
  netWorth: MetricData;
  monthlyIncome: MetricData;
  monthlyExpenses: MetricData;
  cashFlow: MetricData;
}

export interface DashboardSummaryData {
  dashboardSummary: DashboardSummary;
}
