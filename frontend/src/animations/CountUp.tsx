import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { COUNT_UP } from './constants';

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  onEnd?: () => void;
  className?: string;
  startOnView?: boolean;
}

/**
 * CountUp Component
 * Animates a number counting up from start to end value
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = COUNT_UP.duration,
  decimals = COUNT_UP.decimals,
  prefix = COUNT_UP.prefix,
  suffix = COUNT_UP.suffix,
  separator = COUNT_UP.separator,
  onEnd,
  className,
  startOnView = true,
}) => {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    // Only start animation if in view (or startOnView is false)
    if ((startOnView && !isInView) || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    const range = end - start;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);

      // Easing function (easeOutQuad)
      const easedProgress = 1 - (1 - progress) * (1 - progress);

      const currentCount = start + range * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
        onEnd?.();
      }
    };

    requestAnimationFrame(updateCount);
  }, [start, end, duration, isInView, startOnView, onEnd]);

  const formatNumber = (num: number): string => {
    // Round to specified decimals
    const rounded = num.toFixed(decimals);

    // Add thousand separators
    const parts = rounded.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return parts.join('.');
  };

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

CountUp.displayName = 'CountUp';
