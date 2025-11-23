/**
 * Gemini Design System - Color Palette
 * Defines the complete color system for light and dark themes
 */

export const geminiColors = {
  // Primary Colors
  primary: {
    main: '#1A73E8', // Gemini Blue
    light: '#4A90FF',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },

  // Secondary Colors
  secondary: {
    main: '#A142F4', // Gemini Purple
    light: '#B968FF',
    dark: '#7B1FA2',
    contrastText: '#FFFFFF',
  },

  // Success Colors (for income, gains, positive metrics)
  success: {
    main: '#34A853', // Gemini Green
    light: '#57C278',
    dark: '#1E7E34',
    contrastText: '#FFFFFF',
  },

  // Warning Colors (for alerts, pending items)
  warning: {
    main: '#FBBC04', // Gemini Yellow
    light: '#FFCA28',
    dark: '#F57F17',
    contrastText: '#000000',
  },

  // Error Colors (for expenses, losses, negative metrics)
  error: {
    main: '#EA4335', // Gemini Red
    light: '#FF6659',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },

  // Info Colors
  info: {
    main: '#1A73E8',
    light: '#4A90FF',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
} as const;

// Light Theme Colors
export const lightThemeColors = {
  ...geminiColors,

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    subtle: '#F8F9FA',
    elevated: '#FFFFFF',
  },

  // Text Colors
  text: {
    primary: '#202124', // Dark Gray
    secondary: '#5F6368', // Medium Gray
    disabled: '#9AA0A6',
    hint: '#80868B',
  },

  // Divider
  divider: '#E8EAED',

  // Action States
  action: {
    active: '#1A73E8',
    hover: 'rgba(26, 115, 232, 0.04)',
    selected: 'rgba(26, 115, 232, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(26, 115, 232, 0.12)',
  },
} as const;

// Dark Theme Colors
export const darkThemeColors = {
  ...geminiColors,

  // Background Colors
  background: {
    default: '#202124', // Dark Gray
    paper: '#292A2D', // Darker Gray
    subtle: '#35363A',
    elevated: '#3C4043',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E8EAED', // Light Gray
    disabled: '#9AA0A6',
    hint: '#80868B',
  },

  // Divider
  divider: '#5F6368',

  // Action States
  action: {
    active: '#8AB4F8',
    hover: 'rgba(138, 180, 248, 0.08)',
    selected: 'rgba(138, 180, 248, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(138, 180, 248, 0.12)',
  },
} as const;

// Utility function to get theme colors
export const getThemeColors = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightThemeColors : darkThemeColors;
};
