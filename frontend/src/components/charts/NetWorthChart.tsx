import React from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CHART_COLORS,
  CHART_CONFIG,
  CHART_ANIMATION,
  TOOLTIP_STYLES,
  formatCurrency,
  formatCurrencyFull,
  formatMonth,
  formatMonthYear,
} from './chartConfig';

export interface NetWorthDataPoint {
  month: string; // ISO date string (e.g., "2024-01-01")
  netWorth: number;
}

export interface NetWorthChartProps {
  /**
   * Array of net worth data points (12 months)
   */
  data: NetWorthDataPoint[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Chart height in pixels
   */
  height?: number;

  /**
   * Show legend
   */
  showLegend?: boolean;
}

/**
 * NetWorthChart Component
 *
 * Displays a line chart showing net worth trend over time (12 months).
 *
 * Features:
 * - Smooth animated line with gradient
 * - Interactive tooltip with formatted currency
 * - Responsive design
 * - Loading skeleton state
 * - Empty state handling
 */
export const NetWorthChart: React.FC<NetWorthChartProps> = ({
  data,
  loading = false,
  height = CHART_CONFIG.height.md,
  showLegend = false,
}) => {
  const theme = useTheme();

  // Loading state
  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <Box sx={TOOLTIP_STYLES.contentStyle}>
          <Typography variant="body2" sx={TOOLTIP_STYLES.labelStyle}>
            {formatMonthYear(dataPoint.month)}
          </Typography>
          <Typography variant="body2" sx={{ ...TOOLTIP_STYLES.itemStyle, color: CHART_COLORS.netWorth }}>
            Net Worth: {formatCurrencyFull(dataPoint.netWorth)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Net Worth Trend
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={showLegend ? CHART_CONFIG.marginWithLegend : CHART_CONFIG.margin}
        >
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.netWorth} stopOpacity={0.8} />
              <stop offset="95%" stopColor={CHART_COLORS.netWorth} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="netWorth"
            name="Net Worth"
            stroke={CHART_COLORS.netWorth}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.netWorth, r: 4 }}
            activeDot={{ r: 6 }}
            fill="url(#netWorthGradient)"
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
