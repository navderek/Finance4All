import React, { useState } from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileDrawer } from './MobileDrawer';
import { Breadcrumbs } from './Breadcrumbs';

export interface AppLayoutProps {
  /**
   * The main content to display
   */
  children: React.ReactNode;

  /**
   * Whether to show the breadcrumbs
   */
  showBreadcrumbs?: boolean;

  /**
   * Number of unread notifications for the TopBar
   */
  notificationCount?: number;
}

const SIDEBAR_WIDTH = 280;

/**
 * AppLayout Component
 *
 * Main application layout that provides:
 * - Responsive sidebar (permanent on desktop, drawer on mobile)
 * - Top navigation bar
 * - Breadcrumb navigation
 * - Content area
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showBreadcrumbs = true,
  notificationCount = 0,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Bar */}
      <TopBar
        onMenuClick={handleMobileDrawerToggle}
        showMenuButton={isMobile}
        notificationCount={notificationCount}
      />

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Sidebar
          variant="permanent"
          open={true}
          width={SIDEBAR_WIDTH}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={handleMobileDrawerClose}
          width={SIDEBAR_WIDTH}
        />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Toolbar spacer to push content below AppBar */}
        <Toolbar />

        {/* Breadcrumbs */}
        {showBreadcrumbs && <Breadcrumbs />}

        {/* Page Content */}
        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
