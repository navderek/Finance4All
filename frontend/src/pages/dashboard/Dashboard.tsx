import React from 'react';
import { Box, Grid, Typography, Container, Alert, Button, Paper, Chip } from '@mui/material';
import { useQuery } from '@apollo/client';
import { FadeIn, Pulse } from '@animations';
import { MetricCard } from '@/components/dashboard';
import { GET_DASHBOARD_SUMMARY, DashboardSummaryData } from '@/graphql/queries/dashboard';
import {
  NetWorthChart,
  CashFlowChart,
  ExpenseBreakdownChart,
  AccountDistributionChart,
} from '@/components/charts';
import { useRealtimeDashboard } from '@/hooks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

/**
 * Dashboard - Main application dashboard
 *
 * Displays key financial metrics and visualizations in a responsive grid.
 * This is a read-only view that consolidates data from various sources.
 *
 * Features:
 * - Animated metric cards with count-up
 * - Real-time data updates with live indicators
 * - Smooth chart transitions
 * - Loading skeletons
 * - Error handling with retry
 */
export const Dashboard: React.FC = () => {
  // Real-time dashboard data hook (simulated updates every 10 seconds)
  const { metrics, chartData, isLive, lastUpdate, isLoading } = useRealtimeDashboard(10000, true);

  // GraphQL query (will be used when backend is ready)
  const { data, loading: gqlLoading, error, refetch } = useQuery<DashboardSummaryData>(
    GET_DASHBOARD_SUMMARY,
    {
      fetchPolicy: 'cache-and-network',
      skip: true, // Skip for now, using real-time hook instead
    }
  );

  const handleRetry = () => {
    refetch();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <FadeIn>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
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

          {/* Live Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
              label={isLive ? 'Live Update' : 'Live'}
              size="small"
              color={isLive ? 'primary' : 'default'}
              sx={{
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '& .MuiChip-icon': {
                  color: isLive ? 'primary.main' : 'action.active',
                },
              }}
            />
            {lastUpdate && (
              <Typography variant="caption" color="text.secondary">
                Updated {lastUpdate.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
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
              value={metrics.netWorth}
              changePercent={metrics.netWorthChangePercent}
              loading={isLoading}
              icon={<AccountBalanceWalletIcon />}
              delay={0}
            />
          </Grid>

          {/* Income Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Monthly Income"
              value={metrics.monthlyIncome}
              changePercent={metrics.incomeChangePercent}
              loading={isLoading}
              icon={<TrendingUpIcon />}
              positiveColor="success"
              delay={0.1}
            />
          </Grid>

          {/* Expenses Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Monthly Expenses"
              value={metrics.monthlyExpenses}
              changePercent={metrics.expensesChangePercent}
              loading={isLoading}
              icon={<TrendingDownIcon />}
              positiveColor="error"
              delay={0.2}
            />
          </Grid>

          {/* Cash Flow Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              label="Cash Flow"
              value={metrics.cashFlow}
              changePercent={metrics.cashFlowChangePercent}
              loading={isLoading}
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
              <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                <Pulse isActive={isLive} position="top-right" />
                <NetWorthChart data={chartData.netWorth} loading={isLoading} height={300} />
              </Paper>
            </Grid>

            {/* Cash Flow Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                <Pulse isActive={isLive} position="top-right" />
                <CashFlowChart data={chartData.cashFlow} loading={isLoading} height={300} />
              </Paper>
            </Grid>

            {/* Expense Breakdown Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                <Pulse isActive={isLive} position="top-right" />
                <ExpenseBreakdownChart
                  data={chartData.expenseBreakdown}
                  loading={isLoading}
                  height={350}
                />
              </Paper>
            </Grid>

            {/* Account Distribution Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                <Pulse isActive={isLive} position="top-right" />
                <AccountDistributionChart
                  data={chartData.accountDistribution}
                  loading={isLoading}
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
