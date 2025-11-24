import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { TransactionType, getCategoriesByType } from '../../types/transaction';
import { Account } from '../../types/account';
import { TransactionTypeBadge } from './TransactionTypeBadge';

export interface QuickAddTransactionProps {
  open: boolean;
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    accountId: string;
    description?: string;
  }) => void;
}

/**
 * QuickAddTransaction Component
 *
 * Simplified transaction form for quick entry.
 */
export const QuickAddTransaction: React.FC<QuickAddTransactionProps> = ({
  open,
  accounts,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts.length > 0 ? accounts[0].id : '');
  const [description, setDescription] = useState('');

  const categories = getCategoriesByType(type);

  const handleSubmit = () => {
    if (amount && categoryId && accountId) {
      onSubmit({
        type,
        amount: parseFloat(amount),
        categoryId,
        accountId,
        description: description || undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount('');
    setCategoryId('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quick Add Transaction</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Type Toggle */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, value) => value && setType(value)}
            fullWidth
            color={type === TransactionType.INCOME ? 'success' : 'error'}
          >
            <ToggleButton value={TransactionType.INCOME}>
              <TransactionTypeBadge type={TransactionType.INCOME} variant="outlined" />
            </ToggleButton>
            <ToggleButton value={TransactionType.EXPENSE}>
              <TransactionTypeBadge type={TransactionType.EXPENSE} variant="outlined" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Amount */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            required
            autoFocus
          />

          {/* Category */}
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Account */}
          <TextField
            select
            label="Account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Description */}
          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lunch at Chipotle"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!amount || !categoryId || !accountId}
        >
          Add Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};
