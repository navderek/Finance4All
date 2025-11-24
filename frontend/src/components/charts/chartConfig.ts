import { geminiColors } from '@theme/palette';

/**
 * Chart Configuration
 *
 * Shared configurations and utilities for all chart components
 */

// Gemini-themed chart colors
export const CHART_COLORS = {
  primary: geminiColors.primary.main,
  secondary: geminiColors.secondary.main,
  success: geminiColors.success.main,
  warning: geminiColors.warning.main,
  error: geminiColors.error.main,
  income: geminiColors.success.main,
  expense: geminiColors.error.main,
  netWorth: geminiColors.primary.main,
  // Additional color palette for multi-category charts
  palette: [
    '#1A73E8', // Gemini Blue
    '#A142F4', // Gemini Purple
    '#34A853', // Gemini Green
    '#FBBC04', // Gemini Yellow
    '#EA4335', // Gemini Red
    '#FF6B6B', // Coral
    '#4ECDC4', // Turquoise
    '#95E1D3', // Mint
    '#F38181', // Pink
    '#AA96DA', // Lavender
  ],
};

// Chart dimensions and spacing
export const CHART_CONFIG = {
  height: {
    sm: 250,
    md: 300,
    lg: 400,
  },
  margin: {
    top: 5,
    right: 30,
    left: 20,
    bottom: 5,
  },
  marginWithLegend: {
    top: 5,
    right: 30,
    left: 20,
    bottom: 30,
  },
};

// Animation configuration
export const CHART_ANIMATION = {
  duration: 1000,
  easing: 'ease-out' as const,
  delay: 200,
};

// Tooltip styles
export const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  labelStyle: {
    fontWeight: 600,
    marginBottom: '8px',
    color: '#202124',
  },
  itemStyle: {
    color: '#5F6368',
    padding: '4px 0',
  },
};

// Format currency for chart labels
export const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

// Format full currency for tooltips
export const formatCurrencyFull = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format month for chart labels
export const formatMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

// Format month and year for tooltips
export const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Get color from palette by index
export const getColorByIndex = (index: number): string => {
  return CHART_COLORS.palette[index % CHART_COLORS.palette.length];
};
