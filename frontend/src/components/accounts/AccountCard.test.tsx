import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountCard } from './AccountCard';
import { Account, AccountType } from '../../types/account';

const mockAssetAccount: Account = {
  id: '1',
  userId: 'user1',
  name: 'Checking Account',
  type: AccountType.CHECKING,
  category: 'ASSET',
  balance: 5000,
  institution: 'Chase',
  accountNumber: '1234',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-11-23'),
};

const mockLiabilityAccount: Account = {
  id: '2',
  userId: 'user1',
  name: 'Credit Card',
  type: AccountType.CREDIT_CARD,
  category: 'LIABILITY',
  balance: -1200,
  interestRate: 18.99,
  institution: 'American Express',
  accountNumber: '5678',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-11-23'),
};

describe('AccountCard', () => {
  it('should render account name', () => {
    render(<AccountCard account={mockAssetAccount} />);
    expect(screen.getByRole('heading', { name: 'Checking Account' })).toBeInTheDocument();
  });

  it('should render account balance', () => {
    render(<AccountCard account={mockAssetAccount} />);
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('should render negative balance with minus sign for liabilities', () => {
    render(<AccountCard account={mockLiabilityAccount} />);
    expect(screen.getByText(/1,200.00/)).toBeInTheDocument();
  });

  it('should render institution name', () => {
    render(<AccountCard account={mockAssetAccount} />);
    expect(screen.getByText('Chase')).toBeInTheDocument();
  });

  it('should render last 4 digits of account number', () => {
    render(<AccountCard account={mockAssetAccount} />);
    expect(screen.getByText('···· 1234')).toBeInTheDocument();
  });

  it('should render interest rate with APY for assets', () => {
    const accountWithRate: Account = {
      ...mockAssetAccount,
      interestRate: 4.5,
    };
    render(<AccountCard account={accountWithRate} />);
    expect(screen.getByText('4.5% APY')).toBeInTheDocument();
  });

  it('should render interest rate with APR for liabilities', () => {
    render(<AccountCard account={mockLiabilityAccount} />);
    expect(screen.getByText('18.99% APR')).toBeInTheDocument();
  });

  it('should show inactive badge for inactive accounts', () => {
    const inactiveAccount: Account = {
      ...mockAssetAccount,
      isActive: false,
    };
    render(<AccountCard account={inactiveAccount} />);
    expect(screen.getByText('Inactive Account')).toBeInTheDocument();
  });

  it('should call onView when view button is clicked', () => {
    const onView = vi.fn();
    render(<AccountCard account={mockAssetAccount} onView={onView} />);

    const viewButton = screen.getByLabelText('View Details');
    fireEvent.click(viewButton);

    expect(onView).toHaveBeenCalledWith(mockAssetAccount);
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<AccountCard account={mockAssetAccount} onEdit={onEdit} />);

    const editButton = screen.getByLabelText('Edit Account');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockAssetAccount);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<AccountCard account={mockAssetAccount} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Delete Account');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockAssetAccount);
  });

  it('should not render action buttons when handlers are not provided', () => {
    render(<AccountCard account={mockAssetAccount} />);

    expect(screen.queryByLabelText('View Details')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit Account')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete Account')).not.toBeInTheDocument();
  });
});
