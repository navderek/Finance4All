import { Card, CardContent, CardActions, Typography, IconButton, Box, Tooltip, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Transaction,
  formatTransactionAmount,
  formatTransactionDate,
  getTransactionSign,
  TransactionType,
} from '../../types/transaction';
import { CategoryBadge } from './CategoryBadge';
import { FadeIn } from '../../animations/components';

export interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  compact?: boolean;
}

const MotionCard = motion(Card);

/**
 * TransactionCard Component
 *
 * Displays a transaction summary with amount, category, and quick actions.
 */
export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const sign = getTransactionSign(transaction.type);

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
            transform: 'translateY(-2px)',
          },
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {/* Amount */}
              <Typography
                variant={compact ? 'h6' : 'h5'}
                component="div"
                sx={{
                  mb: 0.5,
                  color: isIncome ? 'success.main' : 'error.main',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto Mono, monospace',
                }}
              >
                {sign}
                {formatTransactionAmount(transaction)}
              </Typography>

              {/* Description */}
              {transaction.description && (
                <Typography
                  variant="body1"
                  noWrap
                  sx={{ mb: 0.5, fontWeight: 500 }}
                  title={transaction.description}
                >
                  {transaction.description}
                </Typography>
              )}

              {/* Category Badge */}
              <Box sx={{ mb: compact ? 0 : 1 }}>
                <CategoryBadge categoryId={transaction.categoryId} variant="filled" />
              </Box>

              {/* Account Name */}
              {transaction.accountName && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {transaction.accountName}
                </Typography>
              )}
            </Box>

            {/* Date */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {formatTransactionDate(transaction.date)}
            </Typography>
          </Stack>

          {/* Notes */}
          {!compact && transaction.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {transaction.notes}
            </Typography>
          )}

          {/* Tags */}
          {!compact && transaction.tags && transaction.tags.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {transaction.tags.map((tag) => (
                <Typography
                  key={tag}
                  variant="caption"
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    backgroundColor: 'action.hover',
                    color: 'text.secondary',
                  }}
                >
                  #{tag}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>

        {(onEdit || onDelete) && (
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
            {onEdit && (
              <Tooltip title="Edit Transaction">
                <IconButton size="small" onClick={() => onEdit(transaction)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete Transaction">
                <IconButton size="small" onClick={() => onDelete(transaction)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </CardActions>
        )}
      </MotionCard>
    </FadeIn>
  );
};
