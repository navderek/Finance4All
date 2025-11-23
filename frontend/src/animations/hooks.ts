import { useEffect, useState, RefObject } from 'react';
import { useInView as useFramerInView, useAnimation, AnimationControls } from 'framer-motion';

/**
 * Animation Hooks
 * Custom hooks for scroll-based and view-based animations
 */

// ============================================
// USE IN VIEW HOOK (Re-export from Framer Motion)
// ============================================

export { useInView } from 'framer-motion';

// ============================================
// USE SCROLL ANIMATION HOOK
// ============================================

export interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (
  ref: RefObject<Element>,
  options: UseScrollAnimationOptions = {}
): AnimationControls => {
  const { threshold = 0.1, triggerOnce = true } = options;
  const controls = useAnimation();
  const isInView = useFramerInView(ref, {
    once: triggerOnce,
    amount: threshold,
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  return controls;
};

// ============================================
// USE STAGGER ANIMATION HOOK
// ============================================

export interface UseStaggerAnimationOptions {
  staggerDelay?: number;
  threshold?: number;
}

export const useStaggerAnimation = (
  ref: RefObject<Element>,
  options: UseStaggerAnimationOptions = {}
) => {
  const { staggerDelay = 0.1, threshold = 0.1 } = options;
  const controls = useAnimation();
  const isInView = useFramerInView(ref, {
    once: true,
    amount: threshold,
  });

  useEffect(() => {
    if (isInView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * staggerDelay,
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      }));
    }
  }, [isInView, controls, staggerDelay]);

  return controls;
};

// ============================================
// USE SCROLL PROGRESS HOOK
// ============================================

export const useScrollProgress = (): number => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;

      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

// ============================================
// USE REDUCED MOTION HOOK
// ============================================

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

// ============================================
// USE PARALLAX SCROLL HOOK
// ============================================

export interface UseParallaxOptions {
  speed?: number;
  disabled?: boolean;
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  options: UseParallaxOptions = {}
): number => {
  const { speed = 0.5, disabled = false } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled || !ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;

      // Calculate offset based on scroll position
      const parallaxOffset = (scrolled - elementTop + windowHeight) * speed;
      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed, disabled]);

  return offset;
};

// ============================================
// USE MOUSE POSITION HOOK
// ============================================

export interface MousePosition {
  x: number;
  y: number;
}

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

// ============================================
// USE HOVER ANIMATION HOOK
// ============================================

export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return { isHovered, hoverProps };
};
