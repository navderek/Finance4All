import React from 'react';
import { Box, Grid, Typography, Container, Alert, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { FadeIn } from '@animations';
import { MetricCard } from '@/components/dashboard';
import { GET_DASHBOARD_SUMMARY, DashboardSummaryData } from '@/graphql/queries/dashboard';
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
      </FadeIn>
    </Container>
  );
};
