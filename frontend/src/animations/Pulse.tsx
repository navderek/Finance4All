import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

export interface PulseProps {
  /**
   * Whether the pulse animation is active
   */
  isActive: boolean;

  /**
   * Color of the pulse (default: primary theme color)
   */
  color?: string;

  /**
   * Size of the pulse indicator in pixels (default: 8)
   */
  size?: number;

  /**
   * Position of the pulse indicator
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';

  /**
   * Children to wrap (for positioned pulse)
   */
  children?: React.ReactNode;
}

/**
 * Pulse Component
 *
 * Animated pulse indicator for real-time updates.
 * Shows a pulsing dot animation when isActive is true.
 *
 * Usage:
 * - Inline: <Pulse isActive={isLive} />
 * - Positioned: <Pulse isActive={isLive} position="top-right">{content}</Pulse>
 */
export const Pulse: React.FC<PulseProps> = ({
  isActive,
  color,
  size = 8,
  position = 'inline',
  children,
}) => {
  const pulseAnimation = {
    scale: [1, 1.5, 1],
    opacity: [1, 0.5, 1],
  };

  const ringAnimation = {
    scale: [1, 2],
    opacity: [0.5, 0],
  };

  const positionStyles = {
    'top-right': { position: 'absolute', top: 8, right: 8 },
    'top-left': { position: 'absolute', top: 8, left: 8 },
    'bottom-right': { position: 'absolute', bottom: 8, right: 8 },
    'bottom-left': { position: 'absolute', bottom: 8, left: 8 },
    inline: {},
  };

  const pulseIndicator = (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          style={
            position !== 'inline'
              ? (positionStyles[position] as React.CSSProperties)
              : undefined
          }
        >
          <Box
            sx={{
              position: 'relative',
              width: size,
              height: size,
              display: 'inline-block',
            }}
          >
            {/* Pulse Dot */}
            <motion.div
              animate={pulseAnimation}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: color || '#1A73E8',
              }}
            />

            {/* Expanding Ring */}
            <motion.div
              animate={ringAnimation}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${color || '#1A73E8'}`,
              }}
            />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (position === 'inline') {
    return pulseIndicator;
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {pulseIndicator}
    </Box>
  );
};
