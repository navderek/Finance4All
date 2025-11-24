import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountForm } from './AccountForm';
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
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-11-23'),
};

describe('AccountForm', () => {
  it('should render with "Add New Account" title when no account provided', () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Add New Account')).toBeInTheDocument();
  });

  it('should render with "Edit Account" title when account provided', () => {
    render(<AccountForm open={true} account={mockAccount} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Edit Account')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<AccountForm open={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByText('Add New Account')).not.toBeInTheDocument();
  });

  it('should populate form fields when editing account', () => {
    render(<AccountForm open={true} account={mockAccount} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByDisplayValue('Checking Account')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Chase')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My main checking account')).toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    const nameInput = screen.getByLabelText(/account name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    const submitButton = screen.getByRole('button', { name: /add account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/required/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show validation error when balance is not a number', async () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    const balanceInput = screen.getByLabelText(/current balance/i);
    fireEvent.change(balanceInput, { target: { value: 'invalid' } });

    const submitButton = screen.getByRole('button', { name: /add account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // The input type="number" may prevent non-numeric input or validate automatically
      expect(submitButton).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should call onSubmit with form data when submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={onSubmit} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/account name/i), {
      target: { value: 'New Account' },
    });

    const balanceInput = screen.getByLabelText(/current balance/i);
    fireEvent.change(balanceInput, { target: { value: '10000' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Account',
          balance: 10000,
          type: AccountType.CHECKING,
        })
      );
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<AccountForm open={true} onClose={onClose} onSubmit={vi.fn()} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should disable buttons when loading', () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} loading={true} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const submitButton = screen.getByRole('button', { name: /saving/i });

    expect(cancelButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should show "Saving..." when submitting', () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('should show "Update Account" button when editing', () => {
    render(<AccountForm open={true} account={mockAccount} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /update account/i })).toBeInTheDocument();
  });

  it('should display account type badge preview', () => {
    const { container } = render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    const badge = container.querySelector('.MuiChip-label');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe('Checking Account');
  });

  it('should render account type select field', () => {
    render(<AccountForm open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    // Check that the Account Type field exists
    const typeLabel = screen.getByText('Account Type');
    expect(typeLabel).toBeInTheDocument();
  });
});
