import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Account,
  AccountType,
  AccountCategory,
  AccountFilters,
  AccountSort,
  AccountSortField,
  AccountSortDirection,
} from '../../types/account';
import { AccountCard } from './AccountCard';
import { StaggerList } from '../../animations/components';

export interface AccountsListProps {
  accounts: Account[];
  loading?: boolean;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  onView?: (account: Account) => void;
  onAdd?: () => void;
}

type ViewMode = 'grid' | 'list';

/**
 * AccountsList Component
 *
 * Displays a filterable, sortable list/grid of accounts with search functionality.
 */
export const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<AccountFilters>({
    search: '',
    type: undefined,
    category: undefined,
    isActive: true,
  });
  const [sort, setSort] = useState<AccountSort>({
    field: 'name',
    direction: 'asc',
  });

  // Filter and sort accounts
  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = [...accounts];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (account) =>
          account.name.toLowerCase().includes(searchLower) ||
          account.institution?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      filtered = filtered.filter((account) => account.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter((account) => account.category === filters.category);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter((account) => account.isActive === filters.isActive);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle dates
      if (aValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = (bValue as Date).getTime();
      }

      // Handle strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [accounts, filters, sort]);

  const handleFilterChange = (key: keyof AccountFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (field: AccountSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: undefined,
      category: undefined,
      isActive: true,
    });
  };

  const hasActiveFilters = filters.search || filters.type || filters.category;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Accounts
        </Typography>
        {onAdd && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            Add Account
          </Button>
        )}
      </Box>

      {/* Filters and Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search accounts..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Account Type Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type || ''}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(AccountType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Account Category Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {Object.values(AccountCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort.field}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value as AccountSortField)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="balance">Balance</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="updatedAt">Updated Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* View Mode Toggle */}
          <Grid item xs={12} sm={6} md={2}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Grid>
        </Grid>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2 }}>
            <Button size="small" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* Loading State */}
      {loading && (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedAccounts.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {hasActiveFilters ? 'No accounts found' : 'No accounts yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Get started by adding your first account'}
          </Typography>
          {!hasActiveFilters && onAdd && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              Add Your First Account
            </Button>
          )}
        </Paper>
      )}

      {/* Accounts Grid/List */}
      {!loading && filteredAndSortedAccounts.length > 0 && (
        <StaggerList>
          <Grid container spacing={2}>
            <AnimatePresence>
              {filteredAndSortedAccounts.map((account) => (
                <Grid
                  item
                  xs={12}
                  sm={viewMode === 'grid' ? 6 : 12}
                  md={viewMode === 'grid' ? 4 : 12}
                  key={account.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <AccountCard
                    account={account}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </StaggerList>
      )}

      {/* Results Count */}
      {!loading && filteredAndSortedAccounts.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredAndSortedAccounts.length} of {accounts.length} accounts
          </Typography>
        </Box>
      )}
    </Box>
  );
};
