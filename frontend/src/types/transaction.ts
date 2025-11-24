import { z } from 'zod';

/**
 * Transaction Types and Validation Schemas
 */

// Transaction Type Enum
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Transaction Category (predefined categories)
export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

// Common transaction categories
export const DEFAULT_CATEGORIES: TransactionCategory[] = [
  // Income Categories
  { id: 'salary', name: 'Salary', type: TransactionType.INCOME, icon: 'Work', color: '#34A853' },
  { id: 'freelance', name: 'Freelance', type: TransactionType.INCOME, icon: 'Computer', color: '#34A853' },
  { id: 'investment', name: 'Investment Income', type: TransactionType.INCOME, icon: 'TrendingUp', color: '#34A853' },
  { id: 'gift', name: 'Gift', type: TransactionType.INCOME, icon: 'CardGiftcard', color: '#34A853' },
  { id: 'refund', name: 'Refund', type: TransactionType.INCOME, icon: 'AssignmentReturn', color: '#34A853' },
  { id: 'other-income', name: 'Other Income', type: TransactionType.INCOME, icon: 'Add', color: '#34A853' },

  // Expense Categories
  { id: 'housing', name: 'Housing', type: TransactionType.EXPENSE, icon: 'Home', color: '#EA4335' },
  { id: 'transportation', name: 'Transportation', type: TransactionType.EXPENSE, icon: 'DirectionsCar', color: '#EA4335' },
  { id: 'food', name: 'Food & Dining', type: TransactionType.EXPENSE, icon: 'Restaurant', color: '#EA4335' },
  { id: 'groceries', name: 'Groceries', type: TransactionType.EXPENSE, icon: 'ShoppingCart', color: '#EA4335' },
  { id: 'utilities', name: 'Utilities', type: TransactionType.EXPENSE, icon: 'Bolt', color: '#EA4335' },
  { id: 'healthcare', name: 'Healthcare', type: TransactionType.EXPENSE, icon: 'LocalHospital', color: '#EA4335' },
  { id: 'entertainment', name: 'Entertainment', type: TransactionType.EXPENSE, icon: 'Movie', color: '#EA4335' },
  { id: 'shopping', name: 'Shopping', type: TransactionType.EXPENSE, icon: 'ShoppingBag', color: '#EA4335' },
  { id: 'education', name: 'Education', type: TransactionType.EXPENSE, icon: 'School', color: '#EA4335' },
  { id: 'insurance', name: 'Insurance', type: TransactionType.EXPENSE, icon: 'Security', color: '#EA4335' },
  { id: 'personal', name: 'Personal Care', type: TransactionType.EXPENSE, icon: 'Face', color: '#EA4335' },
  { id: 'subscription', name: 'Subscriptions', type: TransactionType.EXPENSE, icon: 'Subscriptions', color: '#EA4335' },
  { id: 'travel', name: 'Travel', type: TransactionType.EXPENSE, icon: 'Flight', color: '#EA4335' },
  { id: 'other-expense', name: 'Other Expense', type: TransactionType.EXPENSE, icon: 'Remove', color: '#EA4335' },
];

// Transaction interface
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  accountName?: string; // Denormalized for display
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName?: string; // Denormalized for display
  description?: string;
  notes?: string;
  date: Date;
  isRecurring?: boolean;
  recurringPattern?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Transaction form data (for create/edit)
export interface TransactionFormData {
  accountId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description?: string;
  notes?: string;
  date: Date;
  tags?: string[];
}

// Zod validation schema for transaction form
export const transactionFormSchema = z.object({
  accountId: z
    .string()
    .min(1, 'Please select an account'),
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Please select transaction type' }),
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive')
    .finite('Amount must be a finite number'),
  categoryId: z
    .string()
    .min(1, 'Please select a category'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }),
  tags: z.array(z.string()).optional(),
});

// Type inference from schema
export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

// Transaction filter options
export interface TransactionFilters {
  search?: string;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
}

// Transaction sort options
export type TransactionSortField = 'date' | 'amount' | 'description' | 'categoryId' | 'createdAt';
export type TransactionSortDirection = 'asc' | 'desc';

export interface TransactionSort {
  field: TransactionSortField;
  direction: TransactionSortDirection;
}

// Helper functions
export const getCategoryById = (categoryId: string): TransactionCategory | undefined => {
  return DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId);
};

export const getCategoriesByType = (type: TransactionType): TransactionCategory[] => {
  return DEFAULT_CATEGORIES.filter((cat) => cat.type === type);
};

export const formatTransactionAmount = (transaction: Transaction): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(transaction.amount);
};

export const getTransactionColor = (type: TransactionType): string => {
  return type === TransactionType.INCOME ? '#34A853' : '#EA4335';
};

export const getTransactionSign = (type: TransactionType): string => {
  return type === TransactionType.INCOME ? '+' : '-';
};

export const formatTransactionDate = (date: Date): string => {
  return new Intl.DateFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatTransactionDateTime = (date: Date): string => {
  return new Intl.DateFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
};
