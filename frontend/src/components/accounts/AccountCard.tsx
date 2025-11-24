import { Card, CardContent, CardActions, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Account, formatAccountBalance, isLiability } from '../../types/account';
import { AccountBadge } from './AccountBadge';
import { FadeIn } from '../../animations/components';

export interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  onView?: (account: Account) => void;
}

const MotionCard = motion(Card);

/**
 * AccountCard Component
 *
 * Displays an account summary with balance, type, and quick actions.
 */
export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onView,
}) => {
  const isNegative = isLiability(account);

  return (
    <FadeIn>
      <MotionCard
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            elevation: 4,
            transform: 'translateY(-4px)',
          },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, pr: 1 }}>
              {account.name}
            </Typography>
            <AccountBadge type={account.type} variant="filled" />
          </Box>

          <Typography
            variant="h4"
            component="div"
            sx={{
              mb: 1,
              color: isNegative ? 'error.main' : 'success.main',
              fontWeight: 'bold',
              fontFamily: 'Roboto Mono, monospace',
            }}
          >
            {isNegative && '-'}
            {formatAccountBalance(account)}
          </Typography>

          {account.institution && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {account.institution}
            </Typography>
          )}

          {account.accountNumber && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              ···· {account.accountNumber}
            </Typography>
          )}

          {account.interestRate !== undefined && account.interestRate > 0 && (
            <Typography variant="body2" color="text.secondary">
              {account.interestRate}% {isNegative ? 'APR' : 'APY'}
            </Typography>
          )}

          {!account.isActive && (
            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
              Inactive Account
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          {onView && (
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => onView(account)} color="primary">
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit Account">
              <IconButton size="small" onClick={() => onEdit(account)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete Account">
              <IconButton size="small" onClick={() => onDelete(account)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </MotionCard>
    </FadeIn>
  );
};
