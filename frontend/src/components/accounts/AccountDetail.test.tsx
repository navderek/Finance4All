import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountDetail } from './AccountDetail';
import { Account, AccountType } from '../../types/account';

const mockAccount: Account = {
  id: '1',
  userId: 'user1',
  name: 'Checking Account',
  type: AccountType.CHECKING,
  category: 'ASSET',
  balance: 5000,
  interestRate: 0.5,
  institution: 'Chase',
  accountNumber: '1234',
  notes: 'My main checking account',
  isActive: true,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-11-23T15:30:00Z'),
};

const mockInactiveAccount: Account = {
  ...mockAccount,
  isActive: false,
};

describe('AccountDetail', () => {
  it('should render account details', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Checking Account' })).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('Chase')).toBeInTheDocument();
    expect(screen.getByText('···· 1234')).toBeInTheDocument();
    expect(screen.getByText('My main checking account')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<AccountDetail open={false} account={mockAccount} onClose={vi.fn()} />);
    expect(screen.queryByText('Account Details')).not.toBeInTheDocument();
  });

  it('should not render when account is null', () => {
    render(<AccountDetail open={true} account={null} onClose={vi.fn()} />);
    expect(screen.queryByText('Account Details')).not.toBeInTheDocument();
  });

  it('should display inactive badge for inactive accounts', () => {
    render(<AccountDetail open={true} account={mockInactiveAccount} onClose={vi.fn()} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should display interest rate with APY for assets', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);
    expect(screen.getByText(/APY/)).toBeInTheDocument();
    expect(screen.getByText('0.5%')).toBeInTheDocument();
  });

  it('should display interest rate with APR for liabilities', () => {
    const liabilityAccount: Account = {
      ...mockAccount,
      type: AccountType.CREDIT_CARD,
      category: 'LIABILITY',
      balance: -1200,
      interestRate: 18.99,
    };

    render(<AccountDetail open={true} account={liabilityAccount} onClose={vi.fn()} />);
    expect(screen.getByText(/APR/)).toBeInTheDocument();
    expect(screen.getByText('18.99%')).toBeInTheDocument();
  });

  it('should display negative balance with minus sign for liabilities', () => {
    const liabilityAccount: Account = {
      ...mockAccount,
      type: AccountType.CREDIT_CARD,
      category: 'LIABILITY',
      balance: -1200,
    };

    render(<AccountDetail open={true} account={liabilityAccount} onClose={vi.fn()} />);
    expect(screen.getByText(/1,200.00/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<AccountDetail open={true} account={mockAccount} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onClose = vi.fn();
    render(<AccountDetail open={true} account={mockAccount} onClose={onClose} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockAccount);
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    const onClose = vi.fn();
    render(
      <AccountDetail open={true} account={mockAccount} onClose={onClose} onDelete={onDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockAccount);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not show edit button when onEdit is not provided', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('should not show delete button when onDelete is not provided', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('should display created and updated timestamps', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);

    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
  });

  it('should display account ID', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);

    expect(screen.getByText('Account ID')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display category badge', () => {
    render(<AccountDetail open={true} account={mockAccount} onClose={vi.fn()} />);
    expect(screen.getByText('ASSET')).toBeInTheDocument();
  });
});
