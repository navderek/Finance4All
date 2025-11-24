import React from 'react';
import { Sidebar, SidebarProps } from './Sidebar';

export interface MobileDrawerProps {
  /**
   * Whether the mobile drawer is open
   */
  open: boolean;

  /**
   * Callback when the drawer should close
   */
  onClose: () => void;

  /**
   * Sidebar width in pixels
   */
  width?: number;
}

/**
 * MobileDrawer Component
 *
 * A mobile-optimized drawer that wraps the Sidebar component with
 * mobile-specific settings (temporary variant, swipeable, etc.)
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  width = 280,
}) => {
  return (
    <Sidebar
      variant="temporary"
      open={open}
      onClose={onClose}
      width={width}
    />
  );
};
