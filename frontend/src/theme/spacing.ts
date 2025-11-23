/**
 * Gemini Design System - Spacing & Layout
 * Defines spacing scale and responsive breakpoints
 */

// Base spacing unit (8px)
export const baseSpacing = 8;

// Spacing scale (multiples of base unit)
export const spacing = {
  xs: baseSpacing * 0.5, // 4px
  sm: baseSpacing, // 8px
  md: baseSpacing * 2, // 16px
  lg: baseSpacing * 3, // 24px
  xl: baseSpacing * 4, // 32px
  xxl: baseSpacing * 6, // 48px
  xxxl: baseSpacing * 8, // 64px
} as const;

// Responsive breakpoints (in pixels)
export const breakpoints = {
  values: {
    xs: 0, // Mobile (portrait)
    sm: 600, // Mobile (landscape) / Tablet (portrait)
    md: 900, // Tablet (landscape)
    lg: 1200, // Desktop
    xl: 1536, // Large desktop
  },
} as const;

// Container max widths for each breakpoint
export const containerMaxWidths = {
  xs: '100%',
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: '50%',
  pill: '9999px',
} as const;

// Elevation (box-shadow) scale
export const elevation = {
  0: 'none',
  1: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  2: '0px 4px 8px rgba(0, 0, 0, 0.08)',
  3: '0px 8px 16px rgba(0, 0, 0, 0.12)',
  4: '0px 12px 24px rgba(0, 0, 0, 0.15)',
  5: '0px 16px 32px rgba(0, 0, 0, 0.18)',
} as const;

// Z-index scale
export const zIndex = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;

// Transition durations (in ms)
export const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    // Material Design easings
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    // Custom easings
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Helper function to create spacing values
export const createSpacing = (factor: number): string => {
  return `${baseSpacing * factor}px`;
};

// Helper function to create responsive values
export const createResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}) => values;
