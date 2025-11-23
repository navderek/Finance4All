/**
 * Gemini Design System - Typography
 * Defines font families, sizes, and text styles
 */

// Font Families
export const fontFamilies = {
  primary: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  display: '"Google Sans Display", "Google Sans", "Roboto", sans-serif',
  monospace: '"Roboto Mono", "Courier New", monospace',
} as const;

// Font Weights
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Typography Configuration
export const typography = {
  fontFamily: fontFamilies.primary,
  fontWeightLight: fontWeights.light,
  fontWeightRegular: fontWeights.regular,
  fontWeightMedium: fontWeights.medium,
  fontWeightBold: fontWeights.bold,

  // Headings
  h1: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.bold,
    fontSize: '2.5rem', // 40px
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.bold,
    fontSize: '2rem', // 32px
    lineHeight: 1.25,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.semibold,
    fontSize: '1.75rem', // 28px
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.semibold,
    fontSize: '1.5rem', // 24px
    lineHeight: 1.35,
    letterSpacing: '0.00735em',
  },
  h5: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.semibold,
    fontSize: '1.25rem', // 20px
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h6: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.semibold,
    fontSize: '1.125rem', // 18px
    lineHeight: 1.45,
    letterSpacing: '0.0075em',
  },

  // Body Text
  body1: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.regular,
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.regular,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },

  // Subtitles
  subtitle1: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },

  // Button
  button: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none' as const,
  },

  // Caption
  caption: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.regular,
    fontSize: '0.75rem', // 12px
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },

  // Overline
  overline: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    fontSize: '0.75rem', // 12px
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase' as const,
  },

  // Monospace (for numbers, code)
  monospace: {
    fontFamily: fontFamilies.monospace,
    fontWeight: fontWeights.regular,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
} as const;

// Google Fonts import URL
export const googleFontsUrl =
  'https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap';
