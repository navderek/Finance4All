import { z } from 'zod';

/**
 * Account Types and Validation Schemas
 */

// Account Type Enum
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  CREDIT_CARD = 'CREDIT_CARD',
  LOAN = 'LOAN',
  MORTGAGE = 'MORTGAGE',
  OTHER_ASSET = 'OTHER_ASSET',
  OTHER_LIABILITY = 'OTHER_LIABILITY',
}

// Account Category (for grouping)
export enum AccountCategory {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  INVESTMENT = 'INVESTMENT',
}

// Account type metadata
export interface AccountTypeMetadata {
  label: string;
  category: AccountCategory;
  icon: string;
  color: string;
  description: string;
}

export const ACCOUNT_TYPE_METADATA: Record<AccountType, AccountTypeMetadata> = {
  [AccountType.CHECKING]: {
    label: 'Checking Account',
    category: AccountCategory.ASSET,
    icon: 'AccountBalance',
    color: '#1A73E8',
    description: 'Everyday banking account',
  },
  [AccountType.SAVINGS]: {
    label: 'Savings Account',
    category: AccountCategory.ASSET,
    icon: 'Savings',
    color: '#34A853',
    description: 'Interest-bearing savings',
  },
  [AccountType.INVESTMENT]: {
    label: 'Investment Account',
    category: AccountCategory.INVESTMENT,
    icon: 'TrendingUp',
    color: '#A142F4',
    description: 'Stocks, bonds, ETFs, mutual funds',
  },
  [AccountType.CREDIT_CARD]: {
    label: 'Credit Card',
    category: AccountCategory.LIABILITY,
    icon: 'CreditCard',
    color: '#EA4335',
    description: 'Credit card balance',
  },
  [AccountType.LOAN]: {
    label: 'Personal Loan',
    category: AccountCategory.LIABILITY,
    icon: 'AccountBalanceWallet',
    color: '#FBBC04',
    description: 'Personal, auto, or student loan',
  },
  [AccountType.MORTGAGE]: {
    label: 'Mortgage',
    category: AccountCategory.LIABILITY,
    icon: 'Home',
    color: '#FF6D00',
    description: 'Home mortgage or HELOC',
  },
  [AccountType.OTHER_ASSET]: {
    label: 'Other Asset',
    category: AccountCategory.ASSET,
    icon: 'Add',
    color: '#00897B',
    description: 'Other asset account',
  },
  [AccountType.OTHER_LIABILITY]: {
    label: 'Other Liability',
    category: AccountCategory.LIABILITY,
    icon: 'Remove',
    color: '#C62828',
    description: 'Other debt or liability',
  },
};

// Account interface
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  interestRate?: number;
  institution?: string;
  accountNumber?: string; // Last 4 digits only
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Account form data (for create/edit)
export interface AccountFormData {
  name: string;
  type: AccountType;
  balance: number;
  interestRate?: number;
  institution?: string;
  accountNumber?: string;
  notes?: string;
}

// Zod validation schema for account form
export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be less than 100 characters'),
  type: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: 'Please select an account type' }),
  }),
  balance: z
    .number({
      required_error: 'Balance is required',
      invalid_type_error: 'Balance must be a number',
    })
    .finite('Balance must be a finite number'),
  interestRate: z
    .number()
    .min(0, 'Interest rate must be positive')
    .max(100, 'Interest rate must be less than 100%')
    .optional(),
  institution: z.string().max(100, 'Institution name must be less than 100 characters').optional(),
  accountNumber: z
    .string()
    .max(10, 'Account number must be 10 characters or less')
    .optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// Type inference from schema
export type AccountFormSchema = z.infer<typeof accountFormSchema>;

// Account filter options
export interface AccountFilters {
  search?: string;
  type?: AccountType;
  category?: AccountCategory;
  minBalance?: number;
  maxBalance?: number;
  isActive?: boolean;
}

// Account sort options
export type AccountSortField = 'name' | 'type' | 'balance' | 'createdAt' | 'updatedAt';
export type AccountSortDirection = 'asc' | 'desc';

export interface AccountSort {
  field: AccountSortField;
  direction: AccountSortDirection;
}

// Helper functions
export const getAccountCategory = (type: AccountType): AccountCategory => {
  return ACCOUNT_TYPE_METADATA[type].category;
};

export const getAccountTypeLabel = (type: AccountType): string => {
  return ACCOUNT_TYPE_METADATA[type].label;
};

export const getAccountTypeColor = (type: AccountType): string => {
  return ACCOUNT_TYPE_METADATA[type].color;
};

export const isAsset = (account: Account): boolean => {
  return account.category === AccountCategory.ASSET || account.category === AccountCategory.INVESTMENT;
};

export const isLiability = (account: Account): boolean => {
  return account.category === AccountCategory.LIABILITY;
};

export const formatAccountBalance = (account: Account): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (isLiability(account)) {
    return formatter.format(Math.abs(account.balance));
  }

  return formatter.format(account.balance);
};

export const getAccountDisplayBalance = (account: Account): number => {
  if (isLiability(account)) {
    return Math.abs(account.balance);
  }
  return account.balance;
};
