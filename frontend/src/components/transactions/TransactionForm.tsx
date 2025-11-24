import { useEffect, useState } from 'react';
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
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Transaction,
  TransactionFormData,
  transactionFormSchema,
  TransactionType,
  getCategoriesByType,
} from '../../types/transaction';
import { Account } from '../../types/account';
import { CategoryBadge } from './CategoryBadge';
import { TransactionTypeBadge } from './TransactionTypeBadge';

export interface TransactionFormProps {
  open: boolean;
  transaction?: Transaction | null;
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  loading?: boolean;
}

/**
 * TransactionForm Component
 *
 * Form for creating or editing a transaction with validation.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  transaction,
  accounts,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!transaction;
  const [tagInput, setTagInput] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      accountId: '',
      type: TransactionType.EXPENSE,
      amount: 0,
      categoryId: '',
      description: '',
      notes: '',
      date: new Date(),
      tags: [],
    },
  });

  const selectedType = watch('type');
  const selectedTags = watch('tags') || [];

  // Get categories filtered by transaction type
  const availableCategories = getCategoriesByType(selectedType);

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (transaction) {
        reset({
          accountId: transaction.accountId,
          type: transaction.type,
          amount: transaction.amount,
          categoryId: transaction.categoryId,
          description: transaction.description || '',
          notes: transaction.notes || '',
          date: new Date(transaction.date),
          tags: transaction.tags || [],
        });
      } else {
        reset({
          accountId: accounts.length > 0 ? accounts[0].id : '',
          type: TransactionType.EXPENSE,
          amount: 0,
          categoryId: '',
          description: '',
          notes: '',
          date: new Date(),
          tags: [],
        });
      }
    }
  }, [open, transaction, accounts, reset]);

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      onClose();
    }
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: TransactionType | null) => {
    if (newType) {
      setValue('type', newType);
      // Reset category when type changes
      setValue('categoryId', '');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setValue('tags', [...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setValue(
      'tags',
      selectedTags.filter((tag) => tag !== tagToDelete)
    );
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* Transaction Type Toggle */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Type
              </Typography>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    onChange={handleTypeChange}
                    fullWidth
                    color={field.value === TransactionType.INCOME ? 'success' : 'error'}
                  >
                    <ToggleButton value={TransactionType.INCOME}>
                      <TransactionTypeBadge type={TransactionType.INCOME} variant="outlined" />
                    </ToggleButton>
                    <ToggleButton value={TransactionType.EXPENSE}>
                      <TransactionTypeBadge type={TransactionType.EXPENSE} variant="outlined" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={12} md={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      onChange(isNaN(val) ? 0 : val);
                    }}
                    label="Amount"
                    fullWidth
                    required
                    type="number"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Account */}
            <Grid item xs={12} md={6}>
              <Controller
                name="accountId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.accountId}>
                    <InputLabel>Account</InputLabel>
                    <Select {...field} label="Account">
                      {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.accountId && <FormHelperText>{errors.accountId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.categoryId}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {availableCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="e.g., Grocery shopping at Whole Foods"
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
                    placeholder="Add any additional notes..."
                  />
                )}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <TextField
                label="Tags (Optional)"
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Press Enter to add tag"
                InputProps={{
                  endAdornment: tagInput && (
                    <InputAdornment position="end">
                      <Button size="small" onClick={handleAddTag}>
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              {selectedTags.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {selectedTags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} onDelete={() => handleDeleteTag(tag)} size="small" />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting || loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
