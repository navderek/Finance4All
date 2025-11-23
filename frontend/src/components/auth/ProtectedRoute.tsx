import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@components/ui';

export interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireVerification = false,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return <FullPageLoader loading label="Loading..." />;
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to verification page if email verification is required
  if (requireVerification && user && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // If requireAuth is false and user is logged in, redirect to dashboard
  if (!requireAuth && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <Box>{children}</Box>;
};

ProtectedRoute.displayName = 'ProtectedRoute';
