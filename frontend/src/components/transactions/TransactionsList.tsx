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
  Paper,
  Skeleton,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Transaction,
  TransactionType,
  TransactionFilters,
  TransactionSort,
  TransactionSortField,
  DEFAULT_CATEGORIES,
} from '../../types/transaction';
import { Account } from '../../types/account';
import { TransactionCard } from './TransactionCard';
import { StaggerList } from '../../animations/components';

export interface TransactionsListProps {
  transactions: Transaction[];
  accounts?: Account[];
  loading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onAdd?: () => void;
  itemsPerPage?: number;
}

/**
 * TransactionsList Component
 *
 * Displays a filterable, sortable list of transactions with pagination.
 */
export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  accounts = [],
  loading = false,
  onEdit,
  onDelete,
  onAdd,
  itemsPerPage = 12,
}) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: undefined,
    categoryId: undefined,
    accountId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [sort, setSort] = useState<TransactionSort>({
    field: 'date',
    direction: 'desc',
  });

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.description?.toLowerCase().includes(searchLower) ||
          txn.notes?.toLowerCase().includes(searchLower) ||
          txn.accountName?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      filtered = filtered.filter((txn) => txn.type === filters.type);
    }

    if (filters.categoryId) {
      filtered = filtered.filter((txn) => txn.categoryId === filters.categoryId);
    }

    if (filters.accountId) {
      filtered = filtered.filter((txn) => txn.accountId === filters.accountId);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((txn) => new Date(txn.date) >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((txn) => new Date(txn.date) <= filters.dateTo!);
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

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, filters, sort]);

  // Paginate
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, endIndex);
  }, [filteredAndSortedTransactions, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (field: TransactionSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: undefined,
      categoryId: undefined,
      accountId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
    setPage(1);
  };

  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.categoryId ||
    filters.accountId ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Transactions
          </Typography>
          {onAdd && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              Add Transaction
            </Button>
          )}
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search transactions..."
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

            {/* Type Filter */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type || ''}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                  <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.categoryId || ''}
                  label="Category"
                  onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Account Filter */}
            {accounts.length > 0 && (
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Account</InputLabel>
                  <Select
                    value={filters.accountId || ''}
                    label="Account"
                    onChange={(e) => handleFilterChange('accountId', e.target.value || undefined)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Sort */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sort.field}
                  label="Sort By"
                  onChange={(e) => handleSortChange(e.target.value as TransactionSortField)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="categoryId">Category</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date Range - Optional advanced filter */}
            {/* Could add date pickers here */}
          </Grid>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Box sx={{ mt: 2 }}>
              <Button size="small" onClick={clearFilters} startIcon={<FilterIcon />}>
                Clear Filters
              </Button>
            </Box>
          )}
        </Paper>

        {/* Loading State */}
        {loading && (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedTransactions.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              {hasActiveFilters ? 'No transactions found' : 'No transactions yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Get started by adding your first transaction'}
            </Typography>
            {!hasActiveFilters && onAdd && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                Add Your First Transaction
              </Button>
            )}
          </Paper>
        )}

        {/* Transactions Grid */}
        {!loading && paginatedTransactions.length > 0 && (
          <>
            <StaggerList>
              <Grid container spacing={2}>
                <AnimatePresence>
                  {paginatedTransactions.map((transaction) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={transaction.id}
                      component={motion.div}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <TransactionCard
                        transaction={transaction}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </StaggerList>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}

            {/* Results Summary */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * itemsPerPage + 1}-
                {Math.min(page * itemsPerPage, filteredAndSortedTransactions.length)} of{' '}
                {filteredAndSortedTransactions.length} transactions
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};
