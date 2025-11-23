import { motion, HTMLMotionProps, MotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  pageTransition,
  staggerContainer,
  staggerItem,
} from './variants';
import { ANIMATION_PRESETS, REDUCED_MOTION_CONFIG } from './constants';

// ============================================
// HELPER: Reduce Motion Check
// ============================================

const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ============================================
// PAGE TRANSITION COMPONENT
// ============================================

export interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : pageTransition}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PageTransition.displayName = 'PageTransition';

// ============================================
// FADE IN COMPONENT
// ============================================

export interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, direction = 'none', ...props }, ref) => {
    const getVariant = () => {
      switch (direction) {
        case 'up':
          return fadeInUp;
        case 'down':
          return fadeInDown;
        default:
          return fadeIn;
      }
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : getVariant()}
        transition={{ delay }}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

// ============================================
// SLIDE IN COMPONENT
// ============================================

export interface SlideInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'left', delay = 0, ...props }, ref) => {
    const variant = direction === 'left' ? slideInLeft : slideInRight;

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : variant}
        transition={{ delay }}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

SlideIn.displayName = 'SlideIn';

// ============================================
// SCALE IN COMPONENT
// ============================================

export interface ScaleInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : scaleIn}
        transition={{ delay }}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';

// ============================================
// STAGGER LIST COMPONENT
// ============================================

export interface StaggerListProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  staggerDelay?: number;
}

export const StaggerList = forwardRef<HTMLDivElement, StaggerListProps>(
  ({ children, staggerDelay = 0.1, ...props }, ref) => {
    const customStaggerContainer = {
      ...staggerContainer,
      visible: {
        ...staggerContainer.visible,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.05,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : customStaggerContainer}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerList.displayName = 'StaggerList';

// ============================================
// STAGGER ITEM COMPONENT
// ============================================

export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion() ? undefined : staggerItem}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';

// ============================================
// ANIMATED PRESENCE WRAPPER
// ============================================

export interface AnimatedBoxProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const AnimatedBox = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ children, animation = 'fade', direction = 'up', delay = 0, ...props }, ref) => {
    const getVariant = () => {
      if (animation === 'slide') {
        return direction === 'left' ? slideInLeft : slideInRight;
      }
      if (animation === 'scale') {
        return scaleIn;
      }
      if (direction === 'up') {
        return fadeInUp;
      }
      if (direction === 'down') {
        return fadeInDown;
      }
      return fadeIn;
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? undefined : getVariant()}
        transition={{ delay }}
        {...(shouldReduceMotion() && REDUCED_MOTION_CONFIG)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedBox.displayName = 'AnimatedBox';
