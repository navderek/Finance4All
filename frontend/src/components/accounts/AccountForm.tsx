import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Account,
  AccountFormData,
  accountFormSchema,
  AccountType,
  ACCOUNT_TYPE_METADATA,
  getAccountCategory,
} from '../../types/account';
import { AccountBadge } from './AccountBadge';

export interface AccountFormProps {
  open: boolean;
  account?: Account | null;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void | Promise<void>;
  loading?: boolean;
}

/**
 * AccountForm Component
 *
 * Form for creating or editing an account with validation.
 */
export const AccountForm: React.FC<AccountFormProps> = ({
  open,
  account,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!account;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      type: AccountType.CHECKING,
      balance: 0,
      interestRate: undefined,
      institution: '',
      accountNumber: '',
      notes: '',
    },
  });

  const selectedType = watch('type');

  // Reset form when dialog opens/closes or account changes
  useEffect(() => {
    if (open) {
      if (account) {
        reset({
          name: account.name,
          type: account.type,
          balance: account.balance,
          interestRate: account.interestRate,
          institution: account.institution || '',
          accountNumber: account.accountNumber || '',
          notes: account.notes || '',
        });
      } else {
        reset({
          name: '',
          type: AccountType.CHECKING,
          balance: 0,
          interestRate: undefined,
          institution: '',
          accountNumber: '',
          notes: '',
        });
      }
    }
  }, [open, account, reset]);

  const handleFormSubmit = async (data: AccountFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleFormSubmit),
      }}
    >
      <DialogTitle>
        {isEdit ? 'Edit Account' : 'Add New Account'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Account Name */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Account Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="e.g., Chase Checking, Vanguard 401k"
                  autoFocus
                />
              )}
            />
          </Grid>

          {/* Account Type */}
          <Grid item xs={12} md={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.type}>
                  <InputLabel>Account Type</InputLabel>
                  <Select {...field} label="Account Type">
                    {Object.values(AccountType).map((type) => (
                      <MenuItem key={type} value={type}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>{ACCOUNT_TYPE_METADATA[type].label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {/* Account Type Preview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pt: 2 }}>
              <AccountBadge type={selectedType} size="medium" variant="filled" />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                {ACCOUNT_TYPE_METADATA[selectedType].description}
              </Typography>
            </Box>
          </Grid>

          {/* Current Balance */}
          <Grid item xs={12} md={6}>
            <Controller
              name="balance"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onChange(isNaN(val) ? 0 : val);
                  }}
                  label="Current Balance"
                  fullWidth
                  required
                  type="number"
                  error={!!errors.balance}
                  helperText={errors.balance?.message || 'Enter positive for assets, negative for liabilities'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              )}
            />
          </Grid>

          {/* Interest Rate */}
          <Grid item xs={12} md={6}>
            <Controller
              name="interestRate"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                    onChange(val === undefined || isNaN(val) ? undefined : val);
                  }}
                  label="Interest Rate (Optional)"
                  fullWidth
                  type="number"
                  error={!!errors.interestRate}
                  helperText={
                    errors.interestRate?.message ||
                    (getAccountCategory(selectedType) === 'LIABILITY' ? 'APR for loans/debt' : 'APY for savings/investments')
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              )}
            />
          </Grid>

          {/* Institution */}
          <Grid item xs={12} md={6}>
            <Controller
              name="institution"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Financial Institution (Optional)"
                  fullWidth
                  error={!!errors.institution}
                  helperText={errors.institution?.message}
                  placeholder="e.g., Chase, Vanguard, Amex"
                />
              )}
            />
          </Grid>

          {/* Account Number (Last 4 digits) */}
          <Grid item xs={12} md={6}>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last 4 Digits (Optional)"
                  fullWidth
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message || 'Last 4 digits for identification'}
                  placeholder="1234"
                  inputProps={{ maxLength: 10 }}
                />
              )}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes (Optional)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  placeholder="Add any additional notes about this account..."
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting || loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? 'Saving...' : isEdit ? 'Update Account' : 'Add Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
