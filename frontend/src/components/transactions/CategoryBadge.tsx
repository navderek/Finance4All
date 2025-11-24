import { Chip, ChipProps } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { getCategoryById } from '../../types/transaction';

export interface CategoryBadgeProps {
  categoryId: string;
  size?: 'small' | 'medium';
  variant?: ChipProps['variant'];
}

/**
 * CategoryBadge Component
 *
 * Displays a transaction category badge with icon and color.
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryId,
  size = 'small',
  variant = 'outlined',
}) => {
  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <Chip
        label="Unknown"
        size={size}
        variant={variant}
        sx={{ borderColor: '#999', color: '#999' }}
      />
    );
  }

  const IconComponent = (Icons as any)[category.icon] || Icons.Category;

  return (
    <Chip
      icon={<IconComponent />}
      label={category.name}
      size={size}
      variant={variant}
      sx={{
        borderColor: category.color,
        color: category.color,
        '& .MuiChip-icon': {
          color: category.color,
        },
        ...(variant === 'filled' && {
          backgroundColor: `${category.color}15`,
          '&:hover': {
            backgroundColor: `${category.color}25`,
          },
        }),
      }}
    />
  );
};
