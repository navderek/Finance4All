import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountBadge } from './AccountBadge';
import { AccountType, ACCOUNT_TYPE_METADATA } from '../../types/account';

describe('AccountBadge', () => {
  it('should render with correct label for CHECKING account', () => {
    render(<AccountBadge type={AccountType.CHECKING} />);
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
  });

  it('should render with correct label for SAVINGS account', () => {
    render(<AccountBadge type={AccountType.SAVINGS} />);
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
  });

  it('should render with correct label for INVESTMENT account', () => {
    render(<AccountBadge type={AccountType.INVESTMENT} />);
    expect(screen.getByText('Investment Account')).toBeInTheDocument();
  });

  it('should render with correct label for CREDIT_CARD account', () => {
    render(<AccountBadge type={AccountType.CREDIT_CARD} />);
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
  });

  it('should render with correct label for LOAN account', () => {
    render(<AccountBadge type={AccountType.LOAN} />);
    expect(screen.getByText('Personal Loan')).toBeInTheDocument();
  });

  it('should render with correct label for MORTGAGE account', () => {
    render(<AccountBadge type={AccountType.MORTGAGE} />);
    expect(screen.getByText('Mortgage')).toBeInTheDocument();
  });

  it('should render with small size by default', () => {
    const { container } = render(<AccountBadge type={AccountType.CHECKING} />);
    const chip = container.querySelector('.MuiChip-sizeSmall');
    expect(chip).toBeInTheDocument();
  });

  it('should render with medium size when specified', () => {
    const { container } = render(<AccountBadge type={AccountType.CHECKING} size="medium" />);
    const chip = container.querySelector('.MuiChip-sizeMedium');
    expect(chip).toBeInTheDocument();
  });

  it('should render with outlined variant by default', () => {
    const { container } = render(<AccountBadge type={AccountType.CHECKING} />);
    const chip = container.querySelector('.MuiChip-outlined');
    expect(chip).toBeInTheDocument();
  });

  it('should render with filled variant when specified', () => {
    const { container } = render(<AccountBadge type={AccountType.CHECKING} variant="filled" />);
    const chip = container.querySelector('.MuiChip-filled');
    expect(chip).toBeInTheDocument();
  });

  it('should apply correct color for each account type', () => {
    Object.values(AccountType).forEach((type) => {
      const { container } = render(<AccountBadge type={type} />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();

      const metadata = ACCOUNT_TYPE_METADATA[type];
      expect(chip).toHaveStyle({ color: metadata.color });
    });
  });
});
