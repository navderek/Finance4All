import { useState } from 'react';
import { Container, Box, Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Transaction, TransactionFormData, TransactionType } from '../../types/transaction';
import { Account, AccountType } from '../../types/account';
import {
  TransactionsList,
  TransactionForm,
  QuickAddTransaction,
} from '../../components/transactions';
import { PageTransition } from '../../animations/components';

// Mock accounts for development
const mockAccounts: Account[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Chase Checking',
    type: AccountType.CHECKING,
    category: 'ASSET',
    balance: 5234.56,
    institution: 'Chase',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Savings Account',
    type: AccountType.SAVINGS,
    category: 'ASSET',
    balance: 15000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock transactions for development
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user1',
    accountId: '1',
    accountName: 'Chase Checking',
    type: TransactionType.EXPENSE,
    amount: 45.67,
    categoryId: 'food',
    categoryName: 'Food & Dining',
    description: 'Lunch at Chipotle',
    date: new Date('2024-11-22'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    accountId: '1',
    accountName: 'Chase Checking',
    type: TransactionType.INCOME,
    amount: 5000,
    categoryId: 'salary',
    categoryName: 'Salary',
    description: 'Monthly Salary',
    date: new Date('2024-11-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    accountId: '1',
    accountName: 'Chase Checking',
    type: TransactionType.EXPENSE,
    amount: 89.99,
    categoryId: 'shopping',
    categoryName: 'Shopping',
    description: 'Amazon Purchase',
    notes: 'New headphones',
    tags: ['electronics', 'online'],
    date: new Date('2024-11-21'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    userId: 'user1',
    accountId: '2',
    accountName: 'Savings Account',
    type: TransactionType.INCOME,
    amount: 12.34,
    categoryId: 'investment',
    categoryName: 'Investment Income',
    description: 'Interest Payment',
    date: new Date('2024-11-19'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    userId: 'user1',
    accountId: '1',
    accountName: 'Chase Checking',
    type: TransactionType.EXPENSE,
    amount: 125.00,
    categoryId: 'groceries',
    categoryName: 'Groceries',
    description: 'Whole Foods',
    date: new Date('2024-11-18'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * TransactionsPage Component
 *
 * Main page for viewing and managing transactions.
 */
export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [formOpen, setFormOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleAdd = () => {
    setSelectedTransaction(null);
    setFormOpen(true);
  };

  const handleQuickAdd = () => {
    setQuickAddOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormOpen(true);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm(`Delete transaction "${transaction.description || 'transaction'}"?`)) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedTransaction) {
        // Update existing transaction
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === selectedTransaction.id
              ? {
                  ...t,
                  ...data,
                  accountName: mockAccounts.find((a) => a.id === data.accountId)?.name,
                  updatedAt: new Date(),
                }
              : t
          )
        );
      } else {
        // Create new transaction
        const newTransaction: Transaction = {
          id: String(transactions.length + 1),
          userId: 'user1',
          ...data,
          accountName: mockAccounts.find((a) => a.id === data.accountId)?.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
      }

      setFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTransaction: Transaction = {
        id: String(transactions.length + 1),
        userId: 'user1',
        ...data,
        accountName: mockAccounts.find((a) => a.id === data.accountId)?.name,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setQuickAddOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <TransactionsList
            transactions={transactions}
            accounts={mockAccounts}
            loading={false}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>

        {/* Transaction Form Dialog */}
        <TransactionForm
          open={formOpen}
          transaction={selectedTransaction}
          accounts={mockAccounts}
          onClose={() => {
            setFormOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleFormSubmit}
          loading={loading}
        />

        {/* Quick Add FAB */}
        <Tooltip title="Quick Add Transaction">
          <Fab
            color="primary"
            aria-label="quick add"
            onClick={handleQuickAdd}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Quick Add Dialog */}
        <QuickAddTransaction
          open={quickAddOpen}
          accounts={mockAccounts}
          onClose={() => setQuickAddOpen(false)}
          onSubmit={handleQuickAddSubmit}
        />
      </Container>
    </PageTransition>
  );
};
