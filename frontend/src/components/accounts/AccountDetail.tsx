import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Account, formatAccountBalance, ACCOUNT_TYPE_METADATA, isLiability } from '../../types/account';
import { AccountBadge } from './AccountBadge';

export interface AccountDetailProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

/**
 * AccountDetail Component
 *
 * Displays detailed information about an account.
 */
export const AccountDetail: React.FC<AccountDetailProps> = ({
  open,
  account,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!account) return null;

  const metadata = ACCOUNT_TYPE_METADATA[account.type];
  const isNegative = isLiability(account);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(account);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(account);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Account Details
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Account Name and Type */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {account.name}
                </Typography>
                <AccountBadge type={account.type} size="medium" variant="filled" />
              </Box>
              {!account.isActive && (
                <Chip label="Inactive" color="warning" size="small" />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Balance */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Balance
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: isNegative ? 'error.main' : 'success.main',
                fontWeight: 'bold',
                fontFamily: 'Roboto Mono, monospace',
              }}
            >
              {isNegative && '-'}
              {formatAccountBalance(account)}
            </Typography>
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Category
            </Typography>
            <Chip
              label={account.category}
              color={
                account.category === 'ASSET'
                  ? 'success'
                  : account.category === 'LIABILITY'
                  ? 'error'
                  : 'primary'
              }
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Institution */}
          {account.institution && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Financial Institution
              </Typography>
              <Typography variant="body1">{account.institution}</Typography>
            </Grid>
          )}

          {/* Account Number */}
          {account.accountNumber && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Number
              </Typography>
              <Typography variant="body1">···· {account.accountNumber}</Typography>
            </Grid>
          )}

          {/* Interest Rate */}
          {account.interestRate !== undefined && account.interestRate > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Interest Rate ({isNegative ? 'APR' : 'APY'})
              </Typography>
              <Typography variant="h5" sx={{ fontFamily: 'Roboto Mono, monospace' }}>
                {account.interestRate}%
              </Typography>
            </Grid>
          )}

          {/* Notes */}
          {account.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {account.notes}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Metadata */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created
            </Typography>
            <Typography variant="body2">
              {new Date(account.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body2">
              {new Date(account.updatedAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Account ID
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              {account.id}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onDelete && (
              <Button
                onClick={handleDelete}
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose}>Close</Button>
            {onEdit && (
              <Button
                onClick={handleEdit}
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
