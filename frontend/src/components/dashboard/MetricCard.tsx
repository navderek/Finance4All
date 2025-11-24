import React from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import { CountUp, FadeIn } from '@animations';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export interface MetricCardProps {
  /**
   * Metric label (e.g., "Net Worth", "Monthly Income")
   */
  label: string;

  /**
   * Current value to display
   */
  value: number;

  /**
   * Change percentage from previous period
   */
  changePercent?: number;

  /**
   * Optional subtitle text
   */
  subtitle?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Format as currency
   */
  isCurrency?: boolean;

  /**
   * Positive change color (default: success)
   */
  positiveColor?: 'success' | 'error';

  /**
   * Delay before animation starts (in seconds)
   */
  delay?: number;
}

/**
 * MetricCard Component
 *
 * Displays a financial metric with animated count-up and trend indicator.
 *
 * Features:
 * - Animated number count-up
 * - Trend indicator (up/down/flat)
 * - Loading skeleton state
 * - Currency formatting
 * - Customizable colors
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  changePercent,
  subtitle,
  icon,
  loading = false,
  isCurrency = true,
  positiveColor = 'success',
  delay = 0,
}) => {
  const theme = useTheme();

  // Determine trend
  const isPositive = changePercent !== undefined && changePercent > 0;
  const isNegative = changePercent !== undefined && changePercent < 0;
  const isFlat = changePercent !== undefined && changePercent === 0;

  // Determine color based on positive/negative and positiveColor prop
  const getTrendColor = () => {
    if (isPositive) {
      return positiveColor === 'success' ? 'success.main' : 'error.main';
    }
    if (isNegative) {
      return positiveColor === 'success' ? 'error.main' : 'success.main';
    }
    return 'text.secondary';
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (isPositive) return <TrendingUpIcon fontSize="small" />;
    if (isNegative) return <TrendingDownIcon fontSize="small" />;
    if (isFlat) return <TrendingFlatIcon fontSize="small" />;
    return null;
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100%',
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 3,
          },
        }}
      >
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    );
  }

  return (
    <FadeIn delay={delay}>
      <Box
        sx={{
          height: '100%',
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Header with label and icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          {icon && (
            <Box sx={{ color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
        </Box>

        {/* Value with count-up animation */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontFamily: 'Roboto Mono, monospace',
          }}
        >
          <CountUp
            end={value}
            duration={1.5}
            decimals={2}
            prefix={isCurrency ? '$' : ''}
            separator=","
            startOnView
          />
        </Typography>

        {/* Change indicator or subtitle */}
        {changePercent !== undefined ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ color: getTrendColor(), display: 'flex', alignItems: 'center' }}>
              {getTrendIcon()}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: getTrendColor(),
                fontWeight: 600,
              }}
            >
              {isPositive && '+'}
              {changePercent.toFixed(2)}% from last month
            </Typography>
          </Box>
        ) : (
          subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )
        )}
      </Box>
    </FadeIn>
  );
};
