import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Skeleton,
  styled,
} from '@mui/material';
import { forwardRef } from 'react';

export interface CardProps extends Omit<MuiCardProps, 'elevation'> {
  elevation?: number | 'hover';
  clickable?: boolean;
  loading?: boolean;
  header?: {
    title?: React.ReactNode;
    subheader?: React.ReactNode;
    avatar?: React.ReactNode;
    action?: React.ReactNode;
  };
  media?: {
    image: string;
    alt?: string;
    height?: number;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'clickable' && prop !== 'hoverElevation',
})<{ clickable?: boolean; hoverElevation?: boolean }>(({ theme, clickable, hoverElevation }) => ({
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  ...(clickable && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  }),
  ...(hoverElevation && {
    '&:hover': {
      boxShadow: theme.shadows[8],
    },
  }),
}));

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 1,
      clickable = false,
      loading = false,
      header,
      media,
      actions,
      children,
      padding = 'medium',
      ...props
    },
    ref
  ) => {
    const isHoverElevation = elevation === 'hover';
    const actualElevation = isHoverElevation ? 1 : elevation;

    const getPaddingValue = () => {
      switch (padding) {
        case 'none':
          return 0;
        case 'small':
          return 1;
        case 'medium':
          return 2;
        case 'large':
          return 3;
        default:
          return 2;
      }
    };

    if (loading) {
      return (
        <StyledCard ref={ref} elevation={actualElevation} {...props}>
          {header && (
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width="60%" />}
              subheader={<Skeleton variant="text" width="40%" />}
            />
          )}
          {media && (
            <Skeleton variant="rectangular" width="100%" height={media.height || 200} />
          )}
          <CardContent>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
          </CardContent>
          {actions && (
            <CardActions>
              <Skeleton variant="rectangular" width={80} height={36} />
              <Skeleton variant="rectangular" width={80} height={36} />
            </CardActions>
          )}
        </StyledCard>
      );
    }

    return (
      <StyledCard
        ref={ref}
        elevation={actualElevation}
        clickable={clickable}
        hoverElevation={isHoverElevation}
        {...props}
      >
        {header && (
          <CardHeader
            avatar={header.avatar}
            action={header.action}
            title={header.title}
            subheader={header.subheader}
          />
        )}
        {media && <CardMedia component="img" image={media.image} alt={media.alt} height={media.height || 200} />}
        {children && <CardContent sx={{ padding: getPaddingValue() }}>{children}</CardContent>}
        {actions && <CardActions>{actions}</CardActions>}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';
