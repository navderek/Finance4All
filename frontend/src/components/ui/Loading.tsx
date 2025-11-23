import {
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Skeleton,
  SkeletonProps,
  Box,
  BoxProps,
  styled,
  Typography,
} from '@mui/material';
import { forwardRef } from 'react';

// ============================================
// SPINNER COMPONENT (Circular Progress)
// ============================================

export interface SpinnerProps extends CircularProgressProps {
  label?: string;
  centered?: boolean;
}

const SpinnerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'centered',
})<{ centered?: boolean }>(({ centered }) => ({
  ...(centered && {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }),
}));

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ label, centered = false, ...props }, ref) => {
    if (!centered && !label) {
      return <CircularProgress ref={ref as any} {...props} />;
    }

    return (
      <SpinnerContainer ref={ref} centered={centered}>
        <CircularProgress {...props} />
        {label && (
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        )}
      </SpinnerContainer>
    );
  }
);

Spinner.displayName = 'Spinner';

// ============================================
// PROGRESS BAR COMPONENT (Linear Progress)
// ============================================

export interface ProgressBarProps extends LinearProgressProps {
  label?: string;
  showValue?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ label, showValue = false, value, ...props }, ref) => {
    return (
      <Box ref={ref} sx={{ width: '100%' }}>
        {(label || showValue) && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            {label && (
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            )}
            {showValue && value !== undefined && (
              <Typography variant="body2" color="text.secondary">
                {Math.round(value)}%
              </Typography>
            )}
          </Box>
        )}
        <LinearProgress value={value} {...props} />
      </Box>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// ============================================
// LOADING SKELETON COMPONENT
// ============================================

export interface LoadingSkeletonProps extends SkeletonProps {
  count?: number;
  spacing?: number;
}

export const LoadingSkeleton = forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ count = 1, spacing = 1, ...props }, ref) => {
    if (count === 1) {
      return <Skeleton ref={ref as any} {...props} />;
    }

    return (
      <Box ref={ref} sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} {...props} />
        ))}
      </Box>
    );
  }
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

// ============================================
// LOADING OVERLAY COMPONENT
// ============================================

export interface LoadingOverlayProps extends BoxProps {
  loading: boolean;
  children?: React.ReactNode;
  label?: string;
  blur?: boolean;
  spinnerSize?: number;
}

const Overlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'blur',
})<{ blur?: boolean }>(({ theme, blur }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: blur ? 'blur(4px)' : 'none',
  zIndex: theme.zIndex.modal,
}));

export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ loading, children, label, blur = false, spinnerSize = 40, sx, ...props }, ref) => {
    return (
      <Box ref={ref} sx={{ position: 'relative', ...sx }} {...props}>
        {children}
        {loading && (
          <Overlay blur={blur}>
            <CircularProgress size={spinnerSize} />
            {label && (
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            )}
          </Overlay>
        )}
      </Box>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// ============================================
// FULL PAGE LOADER COMPONENT
// ============================================

export interface FullPageLoaderProps {
  loading: boolean;
  label?: string;
  spinnerSize?: number;
}

const FullPageContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  zIndex: theme.zIndex.modal + 100,
}));

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  loading,
  label = 'Loading...',
  spinnerSize = 60,
}) => {
  if (!loading) return null;

  return (
    <FullPageContainer>
      <CircularProgress size={spinnerSize} />
      <Typography variant="h6" color="text.secondary">
        {label}
      </Typography>
    </FullPageContainer>
  );
};

FullPageLoader.displayName = 'FullPageLoader';
