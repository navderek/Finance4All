import { Chip, ChipProps } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { AccountType, ACCOUNT_TYPE_METADATA } from '../../types/account';

export interface AccountBadgeProps {
  type: AccountType;
  size?: 'small' | 'medium';
  variant?: ChipProps['variant'];
}

/**
 * AccountBadge Component
 *
 * Displays an account type badge with icon and color coding.
 */
export const AccountBadge: React.FC<AccountBadgeProps> = ({
  type,
  size = 'small',
  variant = 'outlined',
}) => {
  const metadata = ACCOUNT_TYPE_METADATA[type];
  const IconComponent = (Icons as any)[metadata.icon] || Icons.AccountBalance;

  return (
    <Chip
      icon={<IconComponent />}
      label={metadata.label}
      size={size}
      variant={variant}
      sx={{
        borderColor: metadata.color,
        color: metadata.color,
        '& .MuiChip-icon': {
          color: metadata.color,
        },
        ...(variant === 'filled' && {
          backgroundColor: `${metadata.color}15`,
          '&:hover': {
            backgroundColor: `${metadata.color}25`,
          },
        }),
      }}
    />
  );
};
