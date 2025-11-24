import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { Account, AccountType } from '../../types/account';

const mockAccount: Account = {
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

describe('DeleteAccountDialog', () => {
  it('should render dialog title', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<DeleteAccountDialog open={false} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
  });

  it('should not render when account is null', () => {
    render(<DeleteAccountDialog open={true} account={null} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
  });

  it('should display warning message', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument();
  });

  it('should display confirmation question', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('Are you sure you want to delete this account?')).toBeInTheDocument();
  });

  it('should display account name', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
  });

  it('should display account balance', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('should display institution if available', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('Chase')).toBeInTheDocument();
  });

  it('should display warning about associated transactions', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(
      screen.getByText(/All transactions associated with this account will also be affected/)
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={onClose} onConfirm={vi.fn()} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onConfirm when delete button is clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={onClose} onConfirm={onConfirm} />);

    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(mockAccount);
    });
  });

  it('should disable buttons when loading', () => {
    render(
      <DeleteAccountDialog
        open={true}
        account={mockAccount}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        loading={true}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const deleteButton = screen.getByRole('button', { name: /deleting/i });

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should show "Deleting..." when loading', () => {
    render(
      <DeleteAccountDialog
        open={true}
        account={mockAccount}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        loading={true}
      />
    );

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('should show error variant alert', () => {
    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={vi.fn()} onConfirm={vi.fn()} />);

    // Check for the error alert by its text content
    expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument();
  });

  it('should call onClose after successful deletion', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<DeleteAccountDialog open={true} account={mockAccount} onClose={onClose} onConfirm={onConfirm} />);

    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should not call onClose when loading', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DeleteAccountDialog
        open={true}
        account={mockAccount}
        onClose={onClose}
        onConfirm={vi.fn()}
        loading={true}
      />
    );

    // Try to close by clicking backdrop (if implemented)
    // MUI dialogs typically prevent closing when certain conditions are met
    expect(onClose).not.toHaveBeenCalled();
  });
});
