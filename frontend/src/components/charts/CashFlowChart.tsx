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
  formatMonth,
  formatMonthYear,
} from './chartConfig';

export interface CashFlowDataPoint {
  month: string; // ISO date string (e.g., "2024-01-01")
  income: number;
  expenses: number;
}

export interface CashFlowChartProps {
  /**
   * Array of cash flow data points (typically 6 months)
   */
  data: CashFlowDataPoint[];

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
 * CashFlowChart Component
 *
 * Displays a bar chart comparing income vs expenses over time.
 *
 * Features:
 * - Grouped bars for income (green) and expenses (red)
 * - Interactive tooltip with formatted currency
 * - Responsive design
 * - Loading skeleton state
 * - Empty state handling
 */
export const CashFlowChart: React.FC<CashFlowChartProps> = ({
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
          No data available
        </Typography>
      </Box>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const netCashFlow = dataPoint.income - dataPoint.expenses;
      return (
        <Box sx={TOOLTIP_STYLES.contentStyle}>
          <Typography variant="body2" sx={TOOLTIP_STYLES.labelStyle}>
            {formatMonthYear(dataPoint.month)}
          </Typography>
          <Typography variant="body2" sx={{ ...TOOLTIP_STYLES.itemStyle, color: CHART_COLORS.income }}>
            Income: {formatCurrencyFull(dataPoint.income)}
          </Typography>
          <Typography variant="body2" sx={{ ...TOOLTIP_STYLES.itemStyle, color: CHART_COLORS.expense }}>
            Expenses: {formatCurrencyFull(dataPoint.expenses)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ...TOOLTIP_STYLES.itemStyle,
              fontWeight: 600,
              color: netCashFlow >= 0 ? CHART_COLORS.success : CHART_COLORS.error,
              mt: 1,
              pt: 1,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            Net: {formatCurrencyFull(netCashFlow)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Cash Flow
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={showLegend ? CHART_CONFIG.marginWithLegend : CHART_CONFIG.margin}
        >
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
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          )}
          <Bar
            dataKey="income"
            name="Income"
            fill={CHART_COLORS.income}
            radius={[8, 8, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={CHART_COLORS.expense}
            radius={[8, 8, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
            animationBegin={CHART_ANIMATION.delay}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
