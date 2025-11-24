import React from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_COLORS,
  CHART_CONFIG,
  CHART_ANIMATION,
  TOOLTIP_STYLES,
  formatCurrency,
  formatCurrencyFull,
} from './chartConfig';

export interface AccountDistributionData {
  type: string; // Account type (e.g., "Checking", "Savings", "Investments", "Credit Card")
  assets: number;
  investments: number;
  debt: number;
}

export interface AccountDistributionChartProps {
  /**
   * Array of account distribution data
   */
  data: AccountDistributionData[];

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
 * AccountDistributionChart Component
 *
 * Displays a stacked bar chart showing account balances by type.
 *
 * Features:
 * - Stacked bars for assets, investments, and debt
 * - Color-coded categories (green for assets/investments, red for debt)
 * - Interactive tooltip with formatted currency
 * - Responsive design
 * - Loading skeleton state
 * - Empty state handling
 */
export const AccountDistributionChart: React.FC<AccountDistributionChartProps> = ({
  data,
  loading = false,
  height = CHART_CONFIG.height.md,
  showLegend = true,
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
          No account data available
        </Typography>
      </Box>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + Math.abs(item.value), 0);
      return (
        <Box sx={TOOLTIP_STYLES.contentStyle}>
          <Typography variant="body2" sx={TOOLTIP_STYLES.labelStyle}>
            {label}
          </Typography>
          {payload.map((item: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ ...TOOLTIP_STYLES.itemStyle, color: item.color }}
            >
              {item.name}: {formatCurrencyFull(Math.abs(item.value))}
            </Typography>
          ))}
          <Typography
            variant="body2"
            sx={{
              ...TOOLTIP_STYLES.itemStyle,
              fontWeight: 600,
              mt: 1,
              pt: 1,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            Total: {formatCurrencyFull(total)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Account Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={showLegend ? CHART_CONFIG.marginWithLegend : CHART_CONFIG.margin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="type"
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          )}
          <Bar
            dataKey="assets"
            name="Assets"
            stackId="a"
            fill={CHART_COLORS.success}
            radius={[0, 0, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
          />
          <Bar
            dataKey="investments"
            name="Investments"
            stackId="a"
            fill={CHART_COLORS.primary}
            radius={[0, 0, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
            animationBegin={CHART_ANIMATION.delay}
          />
          <Bar
            dataKey="debt"
            name="Debt"
            stackId="a"
            fill={CHART_COLORS.error}
            radius={[8, 8, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
            animationBegin={CHART_ANIMATION.delay * 2}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
