import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress,
  Box,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef } from 'react';

export interface ModalProps extends Omit<DialogProps, 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  showDividers?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  disableBackdropClick?: boolean;
}

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: theme.zIndex.modal + 1,
}));

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      actions,
      showCloseButton = true,
      showDividers = false,
      loading = false,
      size = 'sm',
      disableBackdropClick = false,
      maxWidth,
      fullScreen,
      ...props
    },
    ref
  ) => {
    // Determine maxWidth based on size prop or explicit maxWidth
    const getMaxWidth = (): DialogProps['maxWidth'] => {
      if (maxWidth) return maxWidth;
      if (size === 'fullscreen') return false;
      return size;
    };

    // Determine fullScreen based on size prop or explicit fullScreen
    const isFullScreen = fullScreen !== undefined ? fullScreen : size === 'fullscreen';

    const handleClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (reason === 'backdropClick' && disableBackdropClick) {
        return;
      }
      onClose();
    };

    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={handleClose}
        maxWidth={getMaxWidth()}
        fullScreen={isFullScreen}
        {...props}
      >
        {loading && (
          <LoadingOverlay>
            <CircularProgress />
          </LoadingOverlay>
        )}

        {title && (
          <>
            <StyledDialogTitle>
              <Box component="span" sx={{ flexGrow: 1 }}>
                {title}
              </Box>
              {showCloseButton && (
                <IconButton
                  aria-label="Close dialog"
                  onClick={onClose}
                  size="small"
                  sx={{ marginLeft: 2 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </StyledDialogTitle>
            {showDividers && <Divider />}
          </>
        )}

        {children && (
          <DialogContent sx={{ padding: isFullScreen ? 3 : 2 }}>{children}</DialogContent>
        )}

        {actions && (
          <>
            {showDividers && <Divider />}
            <DialogActions sx={{ padding: 2 }}>{actions}</DialogActions>
          </>
        )}
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';
