import { useState } from 'react';
import { Container, Box } from '@mui/material';
import { Account, AccountFormData } from '../../types/account';
import {
  AccountsList,
  AccountForm,
  AccountDetail,
  DeleteAccountDialog,
} from '../../components/accounts';
import { PageTransition } from '../../animations/components';

// Mock data for development
const mockAccounts: Account[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Chase Total Checking',
    type: 'CHECKING',
    category: 'ASSET',
    balance: 5234.56,
    institution: 'Chase',
    accountNumber: '1234',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'High Yield Savings',
    type: 'SAVINGS',
    category: 'ASSET',
    balance: 15000.0,
    interestRate: 4.5,
    institution: 'Marcus by Goldman Sachs',
    accountNumber: '5678',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-22'),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Vanguard 401(k)',
    type: 'INVESTMENT',
    category: 'INVESTMENT',
    balance: 87432.12,
    interestRate: 7.2,
    institution: 'Vanguard',
    isActive: true,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-11-23'),
  },
  {
    id: '4',
    userId: 'user1',
    name: 'Amex Blue Cash',
    type: 'CREDIT_CARD',
    category: 'LIABILITY',
    balance: -1245.83,
    interestRate: 18.99,
    institution: 'American Express',
    accountNumber: '9012',
    isActive: true,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2024-11-21'),
  },
  {
    id: '5',
    userId: 'user1',
    name: 'Auto Loan',
    type: 'LOAN',
    category: 'LIABILITY',
    balance: -18500.0,
    interestRate: 4.25,
    institution: 'Capital One',
    notes: '60-month loan, 24 payments remaining',
    isActive: true,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: '6',
    userId: 'user1',
    name: 'Primary Residence',
    type: 'MORTGAGE',
    category: 'LIABILITY',
    balance: -285000.0,
    interestRate: 3.75,
    institution: 'Quicken Loans',
    notes: '30-year fixed mortgage',
    isActive: true,
    createdAt: new Date('2022-05-01'),
    updatedAt: new Date('2024-11-01'),
  },
];

/**
 * AccountsPage Component
 *
 * Main page for managing user accounts (assets, liabilities, investments).
 */
export const AccountsPage: React.FC = () => {
  // State for accounts (will be replaced with API calls)
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Selected account for edit/view/delete
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Loading states (will be used with API)
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleAdd = () => {
    setSelectedAccount(null);
    setFormOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormOpen(true);
  };

  const handleView = (account: Account) => {
    setSelectedAccount(account);
    setDetailOpen(true);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: AccountFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedAccount) {
        // Update existing account
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === selectedAccount.id
              ? {
                  ...acc,
                  ...data,
                  category: data.type === 'CHECKING' || data.type === 'SAVINGS' || data.type === 'OTHER_ASSET'
                    ? 'ASSET'
                    : data.type === 'INVESTMENT'
                    ? 'INVESTMENT'
                    : 'LIABILITY',
                  updatedAt: new Date(),
                }
              : acc
          )
        );
      } else {
        // Create new account
        const newAccount: Account = {
          id: String(accounts.length + 1),
          userId: 'user1',
          ...data,
          category: data.type === 'CHECKING' || data.type === 'SAVINGS' || data.type === 'OTHER_ASSET'
            ? 'ASSET'
            : data.type === 'INVESTMENT'
            ? 'INVESTMENT'
            : 'LIABILITY',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setAccounts((prev) => [...prev, newAccount]);
      }

      setFormOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error saving account:', error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async (account: Account) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAccounts((prev) => prev.filter((acc) => acc.id !== account.id));
      setDeleteOpen(false);
      setSelectedAccount(null);

      // TODO: Show success notification
    } catch (error) {
      console.error('Error deleting account:', error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <AccountsList
            accounts={accounts}
            loading={false}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </Box>

        {/* Account Form Dialog */}
        <AccountForm
          open={formOpen}
          account={selectedAccount}
          onClose={() => {
            setFormOpen(false);
            setSelectedAccount(null);
          }}
          onSubmit={handleFormSubmit}
          loading={loading}
        />

        {/* Account Detail Dialog */}
        <AccountDetail
          open={detailOpen}
          account={selectedAccount}
          onClose={() => {
            setDetailOpen(false);
            setSelectedAccount(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteAccountDialog
          open={deleteOpen}
          account={selectedAccount}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedAccount(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={loading}
        />
      </Container>
    </PageTransition>
  );
};
