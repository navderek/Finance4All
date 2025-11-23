import {
  Snackbar,
  SnackbarProps,
  Alert,
  AlertProps,
  AlertTitle,
  IconButton,
  Slide,
  SlideProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, createContext, useContext, useState, useCallback, useMemo } from 'react';

// ============================================
// TOAST COMPONENT
// ============================================

export interface ToastProps extends Omit<SnackbarProps, 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  severity?: AlertProps['severity'];
  variant?: AlertProps['variant'];
  title?: string;
  message: React.ReactNode;
  showCloseButton?: boolean;
  action?: React.ReactNode;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      onClose,
      severity = 'info',
      variant = 'filled',
      title,
      message,
      showCloseButton = true,
      action,
      autoHideDuration = 6000,
      anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
      TransitionComponent = SlideTransition,
      ...props
    },
    ref
  ) => {
    return (
      <Snackbar
        ref={ref}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={anchorOrigin}
        TransitionComponent={TransitionComponent}
        {...props}
      >
        <Alert
          severity={severity}
          variant={variant}
          onClose={showCloseButton ? onClose : undefined}
          action={action}
          sx={{ width: '100%' }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Snackbar>
    );
  }
);

Toast.displayName = 'Toast';

// ============================================
// TOAST CONTEXT & PROVIDER
// ============================================

export interface ToastOptions {
  severity?: AlertProps['severity'];
  variant?: AlertProps['variant'];
  title?: string;
  autoHideDuration?: number;
  showCloseButton?: boolean;
  action?: React.ReactNode;
  anchorOrigin?: SnackbarProps['anchorOrigin'];
}

export interface ToastItem extends ToastOptions {
  id: string;
  message: React.ReactNode;
  open: boolean;
}

interface ToastContextValue {
  showToast: (message: React.ReactNode, options?: ToastOptions) => void;
  showSuccess: (message: React.ReactNode, options?: Omit<ToastOptions, 'severity'>) => void;
  showError: (message: React.ReactNode, options?: Omit<ToastOptions, 'severity'>) => void;
  showWarning: (message: React.ReactNode, options?: Omit<ToastOptions, 'severity'>) => void;
  showInfo: (message: React.ReactNode, options?: Omit<ToastOptions, 'severity'>) => void;
  closeToast: (id: string) => void;
  closeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 3 }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: React.ReactNode, options: ToastOptions = {}) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = {
        id,
        message,
        open: true,
        ...options,
      };

      setToasts((prev) => {
        const updatedToasts = [...prev, newToast];
        // Keep only the last maxToasts toasts
        return updatedToasts.slice(-maxToasts);
      });
    },
    [maxToasts]
  );

  const showSuccess = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'severity'> = {}) => {
      showToast(message, { ...options, severity: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'severity'> = {}) => {
      showToast(message, { ...options, severity: 'error' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'severity'> = {}) => {
      showToast(message, { ...options, severity: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'severity'> = {}) => {
      showToast(message, { ...options, severity: 'info' });
    },
    [showToast]
  );

  const closeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast))
    );

    // Remove the toast after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const closeAllToasts = useCallback(() => {
    setToasts((prev) => prev.map((toast) => ({ ...toast, open: false })));
    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      closeToast,
      closeAllToasts,
    }),
    [showToast, showSuccess, showError, showWarning, showInfo, closeToast, closeAllToasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          open={toast.open}
          onClose={() => closeToast(toast.id)}
          severity={toast.severity}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          showCloseButton={toast.showCloseButton}
          action={toast.action}
          autoHideDuration={toast.autoHideDuration}
          anchorOrigin={toast.anchorOrigin}
          style={{ marginBottom: index > 0 ? `${index * 60}px` : 0 }}
        />
      ))}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
