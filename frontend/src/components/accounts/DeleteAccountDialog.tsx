import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Account, formatAccountBalance } from '../../types/account';

export interface DeleteAccountDialogProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onConfirm: (account: Account) => void | Promise<void>;
  loading?: boolean;
}

/**
 * DeleteAccountDialog Component
 *
 * Confirmation dialog for deleting an account.
 */
export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  account,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const handleConfirm = async () => {
    if (account) {
      try {
        await onConfirm(account);
        onClose();
      } catch (error) {
        // Error handling is done by parent component
        console.error('Delete error:', error);
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!account) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="error" />
        Delete Account
      </DialogTitle>

      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          This action cannot be undone!
        </Alert>

        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this account?
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Account Name
          </Typography>
          <Typography variant="h6" gutterBottom>
            {account.name}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Current Balance
          </Typography>
          <Typography variant="h6" gutterBottom>
            {formatAccountBalance(account)}
          </Typography>

          {account.institution && (
            <>
              <Typography variant="subtitle2" color="text.secondary">
                Institution
              </Typography>
              <Typography variant="body1">
                {account.institution}
              </Typography>
            </>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: All transactions associated with this account will also be affected.
          Consider making the account inactive instead if you want to preserve historical data.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
