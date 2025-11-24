import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navigationConfig, NavItem, NavSection } from '@config/navigation';
import { spacing } from '@theme/spacing';

export interface SidebarProps {
  /**
   * Whether the sidebar is open (for mobile)
   */
  open?: boolean;

  /**
   * Callback when the sidebar should close (for mobile)
   */
  onClose?: () => void;

  /**
   * Sidebar width in pixels
   */
  width?: number;

  /**
   * Variant of the drawer
   */
  variant?: 'permanent' | 'persistent' | 'temporary';
}

const SIDEBAR_WIDTH = 280;

export const Sidebar: React.FC<SidebarProps> = ({
  open = true,
  onClose,
  width = SIDEBAR_WIDTH,
  variant = 'permanent',
}) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActive = (item: NavItem): boolean => {
    return location.pathname === item.path;
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);

    return (
      <ListItem
        key={item.id}
        disablePadding
        sx={{
          mb: 0.5,
          ...(item.divider && {
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <ListItemButton
          onClick={() => handleNavigation(item.path)}
          selected={active}
          sx={{
            borderRadius: 2,
            mx: 1,
            px: 2,
            py: 1.5,
            transition: theme.transitions.create(
              ['background-color', 'transform'],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            '&:hover': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.mode === 'light' ? 0.08 : 0.12
              ),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.16),
              },
              '& .MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: active
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            {item.badge !== undefined ? (
              <Badge
                badgeContent={item.badge}
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    top: -2,
                    right: -2,
                  },
                }}
              >
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: active ? 600 : 500,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderNavSection = (section: NavSection) => {
    return (
      <Box key={section.id} sx={{ mb: 2 }}>
        {section.title && (
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1,
              display: 'block',
              color: theme.palette.text.secondary,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: 1,
            }}
          >
            {section.title}
          </Typography>
        )}
        <List disablePadding>{section.items.map(renderNavItem)}</List>
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Logo/Brand Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            F4A
          </Box>
        </motion.div>
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            Finance4All
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            lineHeight={1.2}
          >
            Personal Finance
          </Typography>
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.text.secondary, 0.2),
            borderRadius: 3,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.secondary, 0.3),
            },
          },
        }}
      >
        {navigationConfig.map(renderNavSection)}
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
        >
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: theme.shadows[1],
        },
      }}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
