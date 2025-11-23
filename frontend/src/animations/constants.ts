/**
 * Animation Constants
 * Timing, easing, and configuration constants for animations
 */

// ============================================
// TIMING (in seconds)
// ============================================

export const ANIMATION_DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  slower: 0.6,
  slowest: 0.8,
} as const;

// ============================================
// EASING FUNCTIONS
// ============================================

export const EASING = {
  // Standard Material Design easing
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],

  // Custom easing
  spring: [0.175, 0.885, 0.32, 1.275],
  smooth: [0.25, 0.46, 0.45, 0.94],

  // Bounce/elastic
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const SPRING = {
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
  },
  default: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 10,
  },
} as const;

// ============================================
// STAGGER DELAYS
// ============================================

export const STAGGER_DELAY = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;

// ============================================
// DISTANCES (in pixels)
// ============================================

export const SLIDE_DISTANCE = {
  small: 10,
  medium: 20,
  large: 40,
  xlarge: 100,
} as const;

// ============================================
// ANIMATION PRESETS
// ============================================

export const ANIMATION_PRESETS = {
  // Micro-interactions (buttons, toggles)
  microInteraction: {
    duration: ANIMATION_DURATION.fast,
    ease: EASING.easeInOut,
  },

  // Page transitions
  pageTransition: {
    duration: ANIMATION_DURATION.slow,
    ease: EASING.easeInOut,
  },

  // Modal/dialog animations
  modal: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.spring,
  },

  // Toast/snackbar
  toast: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.smooth,
  },

  // Card reveals
  cardReveal: {
    duration: ANIMATION_DURATION.slow,
    ease: EASING.easeOut,
  },
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const REDUCED_MOTION_CONFIG = {
  // Disable animations for users who prefer reduced motion
  transition: {
    duration: 0,
  },
} as const;

// ============================================
// CHART ANIMATIONS
// ============================================

export const CHART_ANIMATION = {
  duration: 800, // milliseconds (for chart libraries)
  delay: 50,
  easing: 'ease-in-out',
} as const;

// ============================================
// COUNT-UP ANIMATIONS
// ============================================

export const COUNT_UP = {
  duration: 1.5, // seconds
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
} as const;
