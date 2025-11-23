/**
 * Gemini Design System - Theme Configuration
 * Main theme file that combines all design tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { getThemeColors } from './palette';
import { typography } from './typography';
import { breakpoints, borderRadius, elevation, zIndex, transitions } from './spacing';

// Base theme options shared by both light and dark themes
const baseThemeOptions: ThemeOptions = {
  typography,
  breakpoints,
  shape: {
    borderRadius: borderRadius.md,
  },
  zIndex,
  transitions: {
    duration: transitions.duration,
    easing: transitions.easing,
  },
  components: {
    // Global component overrides
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: elevation[2],
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
        sizeMedium: {
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: elevation[1],
          transition: `box-shadow ${transitions.duration.standard}ms ${transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: elevation[3],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.pill,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.xl,
        },
      },
    },
  },
};

// Create light theme
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    ...getThemeColors('light'),
  },
});

// Create dark theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    ...getThemeColors('dark'),
  },
  components: {
    ...baseThemeOptions.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...baseThemeOptions.components?.MuiCssBaseline?.styleOverrides,
        body: {
          ...((baseThemeOptions.components?.MuiCssBaseline?.styleOverrides as any)?.body || {}),
          backgroundColor: '#202124',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(255,255,255,0.3)',
        },
      },
    },
  },
});

// Export theme utility functions
export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};

// Export all theme tokens
export { getThemeColors } from './palette';
export { typography, fontFamilies, fontWeights } from './typography';
export { spacing, borderRadius, elevation, zIndex, transitions } from './spacing';
export * from './palette';
