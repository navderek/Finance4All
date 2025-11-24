import React from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  CHART_COLORS,
  CHART_CONFIG,
  CHART_ANIMATION,
  TOOLTIP_STYLES,
  formatCurrencyFull,
  getColorByIndex,
} from './chartConfig';

export interface ExpenseCategoryData {
  category: string;
  amount: number;
  color?: string; // Optional custom color
}

export interface ExpenseBreakdownChartProps {
  /**
   * Array of expense categories with amounts
   */
  data: ExpenseCategoryData[];

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
 * ExpenseBreakdownChart Component
 *
 * Displays a donut chart showing expense distribution by category.
 *
 * Features:
 * - Interactive donut chart with hover effects
 * - Color-coded categories
 * - Percentage and amount display in tooltip
 * - Responsive design
 * - Loading skeleton state
 * - Empty state handling
 */
export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
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
        <Skeleton variant="circular" width={height} height={height} sx={{ mx: 'auto' }} />
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
          No expenses to display
        </Typography>
      </Box>
    );
  }

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Assign colors if not provided
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || getColorByIndex(index),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      const percentage = ((dataPoint.value / total) * 100).toFixed(1);
      return (
        <Box sx={TOOLTIP_STYLES.contentStyle}>
          <Typography variant="body2" sx={TOOLTIP_STYLES.labelStyle}>
            {dataPoint.name}
          </Typography>
          <Typography variant="body2" sx={{ ...TOOLTIP_STYLES.itemStyle, color: dataPoint.payload.color }}>
            Amount: {formatCurrencyFull(dataPoint.value)}
          </Typography>
          <Typography variant="body2" sx={TOOLTIP_STYLES.itemStyle}>
            {percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom label for pie slices
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is > 5%
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Expense Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={height / 3}
            innerRadius={height / 4.5} // Creates donut hole
            fill="#8884d8"
            dataKey="amount"
            nameKey="category"
            animationDuration={CHART_ANIMATION.duration}
            animationEasing={CHART_ANIMATION.easing}
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                fontSize: '12px',
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
