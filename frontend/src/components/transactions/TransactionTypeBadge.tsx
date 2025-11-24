import { Chip, ChipProps } from '@mui/material';
import { TrendingUp as IncomeIcon, TrendingDown as ExpenseIcon } from '@mui/icons-material';
import { TransactionType } from '../../types/transaction';

export interface TransactionTypeBadgeProps {
  type: TransactionType;
  size?: 'small' | 'medium';
  variant?: ChipProps['variant'];
}

/**
 * TransactionTypeBadge Component
 *
 * Displays a transaction type badge (Income/Expense) with icon and color.
 */
export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({
  type,
  size = 'small',
  variant = 'filled',
}) => {
  const isIncome = type === TransactionType.INCOME;

  return (
    <Chip
      icon={isIncome ? <IncomeIcon /> : <ExpenseIcon />}
      label={type}
      size={size}
      variant={variant}
      color={isIncome ? 'success' : 'error'}
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          marginLeft: size === 'small' ? 0.5 : 1,
        },
      }}
    />
  );
};
