import { z } from 'zod';

// ============================================
// USER VALIDATION SCHEMAS
// ============================================

export const createUserSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  email: z.string().email('Invalid email address'),
  displayName: z.string().optional(),
  photoUrl: z.string().url('Invalid photo URL').optional(),
});

export const updateUserSchema = z.object({
  displayName: z.string().optional(),
  photoUrl: z.string().url('Invalid photo URL').optional(),
});

// ============================================
// ACCOUNT VALIDATION SCHEMAS
// ============================================

export const accountTypeSchema = z.enum(['ASSET', 'INVESTMENT', 'DEBT', 'LIABILITY']);

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Account name too long'),
  type: accountTypeSchema,
  subtype: z.string().max(50, 'Subtype too long').optional(),
  balance: z.number().finite('Balance must be a valid number'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
  institution: z.string().max(100, 'Institution name too long').optional(),
  accountNumber: z.string().max(20, 'Account number too long').optional(),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate too high').optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Account name too long').optional(),
  type: accountTypeSchema.optional(),
  subtype: z.string().max(50, 'Subtype too long').optional(),
  balance: z.number().finite('Balance must be a valid number').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  institution: z.string().max(100, 'Institution name too long').optional(),
  accountNumber: z.string().max(20, 'Account number too long').optional(),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate too high').optional(),
  isActive: z.boolean().optional(),
});

export const accountFilterSchema = z.object({
  type: accountTypeSchema.optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// CATEGORY VALIDATION SCHEMAS
// ============================================

export const categoryTypeSchema = z.enum(['INCOME', 'EXPENSE']);

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  type: categoryTypeSchema,
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #1A73E8)').optional(),
  icon: z.string().max(50, 'Icon identifier too long').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long').optional(),
  type: categoryTypeSchema.optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  icon: z.string().max(50, 'Icon identifier too long').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
});

// ============================================
// TRANSACTION VALIDATION SCHEMAS
// ============================================

export const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE', 'TRANSFER']);

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  amount: z.number().positive('Amount must be positive'),
  type: transactionTypeSchema,
  description: z.string().max(200, 'Description too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  recurringId: z.string().uuid('Invalid recurring ID').optional(),
});

export const updateTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
  amount: z.number().positive('Amount must be positive').optional(),
  type: transactionTypeSchema.optional(),
  description: z.string().max(200, 'Description too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  date: z.date().optional(),
  isRecurring: z.boolean().optional(),
  recurringId: z.string().uuid('Invalid recurring ID').optional().nullable(),
});

export const transactionFilterSchema = z.object({
  accountId: z.string().uuid('Invalid account ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  type: transactionTypeSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minAmount: z.number().min(0, 'Minimum amount cannot be negative').optional(),
  maxAmount: z.number().positive('Maximum amount must be positive').optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  { message: 'Start date must be before end date' }
).refine(
  (data) => {
    if (data.minAmount !== undefined && data.maxAmount !== undefined) {
      return data.minAmount <= data.maxAmount;
    }
    return true;
  },
  { message: 'Minimum amount must be less than maximum amount' }
);

export const paginationSchema = z.object({
  offset: z.number().int('Offset must be an integer').min(0, 'Offset cannot be negative').default(0),
  limit: z.number().int('Limit must be an integer').min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(50),
});

// ============================================
// BUDGET VALIDATION SCHEMAS
// ============================================

export const budgetPeriodSchema = z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']);

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  amount: z.number().positive('Budget amount must be positive'),
  period: budgetPeriodSchema,
  startDate: z.date(),
  endDate: z.date().optional(),
}).refine(
  (data) => {
    if (data.endDate) {
      return data.startDate < data.endDate;
    }
    return true;
  },
  { message: 'Start date must be before end date' }
);

export const updateBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID').optional(),
  amount: z.number().positive('Budget amount must be positive').optional(),
  period: budgetPeriodSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

// ============================================
// PROJECTION VALIDATION SCHEMAS
// ============================================

export const createProjectionSchema = z.object({
  name: z.string().min(1, 'Projection name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  incomeGrowthRate: z.number().min(-100, 'Income growth rate too low').max(100, 'Income growth rate too high'),
  investmentReturn: z.number().min(-100, 'Investment return too low').max(100, 'Investment return too high'),
  inflationRate: z.number().min(-10, 'Inflation rate too low').max(50, 'Inflation rate too high'),
});

export const updateProjectionSchema = z.object({
  name: z.string().min(1, 'Projection name is required').max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  incomeGrowthRate: z.number().min(-100, 'Income growth rate too low').max(100, 'Income growth rate too high').optional(),
  investmentReturn: z.number().min(-100, 'Investment return too low').max(100, 'Investment return too high').optional(),
  inflationRate: z.number().min(-10, 'Inflation rate too low').max(50, 'Inflation rate too high').optional(),
});

// ============================================
// VALIDATION HELPER FUNCTION
// ============================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw error;
  }
}
