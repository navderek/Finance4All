import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AccountsList } from './AccountsList';
import { Account, AccountType } from '../../types/account';

const mockAccounts: Account[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Checking Account',
    type: AccountType.CHECKING,
    category: 'ASSET',
    balance: 5000,
    institution: 'Chase',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-23'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Savings Account',
    type: AccountType.SAVINGS,
    category: 'ASSET',
    balance: 10000,
    institution: 'Marcus',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-22'),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Credit Card',
    type: AccountType.CREDIT_CARD,
    category: 'LIABILITY',
    balance: -1200,
    institution: 'Amex',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-21'),
  },
];

describe('AccountsList', () => {
  it('should render title', () => {
    render(<AccountsList accounts={mockAccounts} />);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('should render all accounts', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);
    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards.length).toBeGreaterThanOrEqual(3);
  });

  it('should render add account button when onAdd is provided', () => {
    const onAdd = vi.fn();
    render(<AccountsList accounts={mockAccounts} onAdd={onAdd} />);

    const addButton = screen.getAllByRole('button', { name: /add account/i })[0];
    expect(addButton).toBeInTheDocument();
  });

  it('should call onAdd when add button is clicked', () => {
    const onAdd = vi.fn();
    render(<AccountsList accounts={mockAccounts} onAdd={onAdd} />);

    const addButton = screen.getAllByRole('button', { name: /add account/i })[0];
    fireEvent.click(addButton);

    expect(onAdd).toHaveBeenCalled();
  });

  it('should filter accounts by search term', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'Checking' } });

    // After filtering, should have fewer accounts
    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards.length).toBe(1);
  });

  it('should filter accounts by institution', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'Chase' } });

    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards.length).toBe(1);
  });

  it('should filter accounts by type', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    const typeSelect = screen.getByLabelText('Type');
    fireEvent.mouseDown(typeSelect);

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('CHECKING'));

    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards.length).toBe(1);
  });

  it('should filter accounts by category', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    const categorySelect = screen.getByLabelText('Category');
    fireEvent.mouseDown(categorySelect);

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('LIABILITY'));

    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards.length).toBe(1);
  });

  it('should sort accounts by name', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    const sortSelect = screen.getByLabelText('Sort By');
    fireEvent.mouseDown(sortSelect);

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('Name'));

    // Check that accounts are in alphabetical order
    const accountCards = container.querySelectorAll('[class*="MuiCard"]');
    expect(accountCards).toHaveLength(3);
  });

  it('should show empty state when no accounts', () => {
    render(<AccountsList accounts={[]} />);
    expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first account')).toBeInTheDocument();
  });

  it('should show empty state with filter message when filtered to no results', () => {
    render(<AccountsList accounts={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentAccount' } });

    expect(screen.getByText('No accounts found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('should show clear filters button when filters are active', () => {
    render(<AccountsList accounts={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should clear filters when clear button is clicked', () => {
    render(<AccountsList accounts={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  it('should show loading skeletons when loading', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} loading={true} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show results count', () => {
    render(<AccountsList accounts={mockAccounts} />);
    expect(screen.getByText('Showing 3 of 3 accounts')).toBeInTheDocument();
  });

  it('should render view mode toggle buttons', () => {
    const { container } = render(<AccountsList accounts={mockAccounts} />);

    // Check that toggle buttons exist
    const toggleButtons = container.querySelectorAll('.MuiToggleButton-root');
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2);
  });
});
