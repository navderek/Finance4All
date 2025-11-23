/**
 * Animations Module
 * Exports all animation components, hooks, variants, and constants
 */

// Animation Components
export {
  PageTransition,
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerList,
  StaggerItem,
  AnimatedBox,
} from './components';
export type {
  PageTransitionProps,
  FadeInProps,
  SlideInProps,
  ScaleInProps,
  StaggerListProps,
  StaggerItemProps,
  AnimatedBoxProps,
} from './components';

// Count Up Component
export { CountUp } from './CountUp';
export type { CountUpProps } from './CountUp';

// Animation Hooks
export {
  useInView,
  useScrollAnimation,
  useStaggerAnimation,
  useScrollProgress,
  useReducedMotion,
  useParallax,
  useMousePosition,
  useHoverAnimation,
} from './hooks';
export type {
  UseScrollAnimationOptions,
  UseStaggerAnimationOptions,
  UseParallaxOptions,
  MousePosition,
} from './hooks';

// Animation Variants
export {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  scaleInCenter,
  staggerContainer,
  staggerItem,
  pageTransition,
  cardHover,
  cardTap,
  shimmer,
  bounce,
  shake,
} from './variants';

// Animation Constants
export {
  ANIMATION_DURATION,
  EASING,
  SPRING,
  STAGGER_DELAY,
  SLIDE_DISTANCE,
  ANIMATION_PRESETS,
  REDUCED_MOTION_CONFIG,
  CHART_ANIMATION,
  COUNT_UP,
} from './constants';
