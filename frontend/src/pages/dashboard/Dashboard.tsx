import React, { useMemo } from 'react';
import { Box, Grid, Typography, Container, Alert, Button, Paper } from '@mui/material';
import { useQuery } from '@apollo/client';
import { FadeIn } from '@animations';
import { MetricCard } from '@/components/dashboard';
import { GET_DASHBOARD_SUMMARY, DashboardSummaryData } from '@/graphql/queries/dashboard';
import {
  NetWorthChart,
  CashFlowChart,
  ExpenseBreakdownChart,
  AccountDistributionChart,
} from '@/components/charts';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Dashboard - Main application dashboard
 *
 * Displays key financial metrics and visualizations in a responsive grid.
 * This is a read-only view that consolidates data from various sources.
 *
 * Features:
 * - Animated metric cards with count-up
 * - Real-time data from GraphQL API
 * - Loading skeletons
 * - Error handling with retry
 */
export const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<DashboardSummaryData>(GET_DASHBOARD_SUMMARY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const handleRetry = () => {
    refetch();
  };

  // Generate mock data for charts
  // TODO: Replace with real data from GraphQL query when backend is ready
  const chartData = useMemo(() => {
    const now = new Date();
    const months = [];

    // Generate 12 months of net worth data
    const netWorthData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      netWorthData.push({
        month: date.toISOString(),
        netWorth: 50000 + (11 - i) * 3000 + Math.random() * 5000,
      });
    }

    // Generate 6 months of cash flow data
    const cashFlowData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      cashFlowData.push({
        month: date.toISOString(),
        income: 5000 + Math.random() * 1000,
        expenses: 3500 + Math.random() * 800,
      });
    }

    // Generate expense breakdown data
    const expenseBreakdownData = [
      { category: 'Housing', amount: 1200 },
      { category: 'Food', amount: 600 },
      { category: 'Transportation', amount: 400 },
      { category: 'Entertainment', amount: 300 },
      { category: 'Utilities', amount: 250 },
      { category: 'Healthcare', amount: 200 },
      { category: 'Other', amount: 350 },
    ];

    // Generate account distribution data
    const accountDistributionData = [
      { type: 'Checking', assets: 5000, investments: 0, debt: 0 },
      { type: 'Savings', assets: 15000, investments: 0, debt: 0 },
      { type: 'Investment', assets: 0, investments: 45000, debt: 0 },
      { type: 'Credit Card', assets: 0, investments: 0, debt: 2500 },
      { type: 'Loan', assets: 0, investments: 0, debt: 5000 },
    ];

    return {
      netWorth: netWorthData,
      cashFlow: cashFlowData,
      expenseBreakdown: expenseBreakdownData,
      accountDistribution: accountDistributionData,
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <FadeIn>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your financial overview at a glance
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
                Retry
              </Button>
            }
          >
            Failed to load dashboard data: {error.message}
          </Alert>
        )}

        {/* Metric Cards Grid */}
        <Grid container spacing={3}>
          {/* Net Worth Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Net Worth"
              value={data?.dashboardSummary?.netWorth?.current ?? 0}
              changePercent={data?.dashboardSummary?.netWorth?.changePercent}
              loading={loading}
              icon={<AccountBalanceWalletIcon />}
              delay={0}
            />
          </Grid>

          {/* Income Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Monthly Income"
              value={data?.dashboardSummary?.monthlyIncome?.current ?? 0}
              changePercent={data?.dashboardSummary?.monthlyIncome?.changePercent}
              loading={loading}
              icon={<TrendingUpIcon />}
              positiveColor="success"
              delay={0.1}
            />
          </Grid>

          {/* Expenses Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Monthly Expenses"
              value={data?.dashboardSummary?.monthlyExpenses?.current ?? 0}
              changePercent={data?.dashboardSummary?.monthlyExpenses?.changePercent}
              loading={loading}
              icon={<TrendingDownIcon />}
              positiveColor="error"
              delay={0.2}
            />
          </Grid>

          {/* Cash Flow Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Cash Flow"
              value={data?.dashboardSummary?.cashFlow?.current ?? 0}
              changePercent={data?.dashboardSummary?.cashFlow?.changePercent}
              loading={loading}
              icon={<AccountBalanceIcon />}
              delay={0.3}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Net Worth Trend Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <NetWorthChart data={chartData.netWorth} loading={loading} height={300} />
              </Paper>
            </Grid>

            {/* Cash Flow Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <CashFlowChart data={chartData.cashFlow} loading={loading} height={300} />
              </Paper>
            </Grid>

            {/* Expense Breakdown Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <ExpenseBreakdownChart
                  data={chartData.expenseBreakdown}
                  loading={loading}
                  height={350}
                />
              </Paper>
            </Grid>

            {/* Account Distribution Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <AccountDistributionChart
                  data={chartData.accountDistribution}
                  loading={loading}
                  height={350}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </FadeIn>
    </Container>
  );
};
