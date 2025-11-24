import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '@config/navigation';

export interface BreadcrumbsProps {
  /**
   * Whether to show the home icon for the first breadcrumb
   */
  showHomeIcon?: boolean;

  /**
   * Maximum number of breadcrumbs to display before collapsing
   */
  maxItems?: number;
}

/**
 * Breadcrumbs Component
 *
 * Displays the current navigation path with clickable links
 * Automatically updates based on the current route
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  showHomeIcon = true,
  maxItems = 8,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        maxItems={maxItems}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isHome = crumb.path === '/dashboard';

          if (isLast) {
            // Last breadcrumb is not clickable
            return (
              <Box
                key={crumb.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {isHome && showHomeIcon && (
                  <HomeIcon
                    sx={{ fontSize: 20, color: theme.palette.text.primary }}
                  />
                )}
                <Typography
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {crumb.label}
                </Typography>
              </Box>
            );
          }

          // Other breadcrumbs are clickable links
          return (
            <Link
              key={crumb.path}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.875rem',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
                transition: theme.transitions.create('color', {
                  duration: theme.transitions.duration.shorter,
                }),
              }}
            >
              {isHome && showHomeIcon && (
                <HomeIcon
                  sx={{ fontSize: 20 }}
                />
              )}
              {crumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};
