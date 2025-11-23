import {
  createAccountSchema,
  updateAccountSchema,
  createTransactionSchema,
  updateTransactionSchema,
  createCategorySchema,
  updateCategorySchema,
  createBudgetSchema,
  updateBudgetSchema,
  createProjectionSchema,
} from '../src/utils/validation';

describe('Validation Schemas', () => {
  describe('Account Validation', () => {
    describe('createAccountSchema', () => {
      it('should validate a valid account creation', () => {
        const validAccount = {
          name: 'Main Checking',
          type: 'ASSET',
          subtype: 'Checking',
          balance: 5000.0,
          currency: 'USD',
          institution: 'Test Bank',
        };

        const result = createAccountSchema.safeParse(validAccount);
        expect(result.success).toBe(true);
      });

      it('should reject account with empty name', () => {
        const invalidAccount = {
          name: '',
          type: 'ASSET',
          balance: 5000.0,
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('required');
        }
      });

      it('should reject account with invalid type', () => {
        const invalidAccount = {
          name: 'Test Account',
          type: 'INVALID_TYPE',
          balance: 5000.0,
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
      });

      it('should reject account with non-finite balance', () => {
        const invalidAccount = {
          name: 'Test Account',
          type: 'ASSET',
          balance: Infinity,
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('valid number');
        }
      });

      it('should reject account with invalid currency code', () => {
        const invalidAccount = {
          name: 'Test Account',
          type: 'ASSET',
          balance: 5000.0,
          currency: 'US', // Must be 3 characters
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('3 characters');
        }
      });

      it('should reject account with negative interest rate', () => {
        const invalidAccount = {
          name: 'Test Account',
          type: 'ASSET',
          balance: 5000.0,
          interestRate: -5.0,
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('negative');
        }
      });

      it('should reject account with excessively high interest rate', () => {
        const invalidAccount = {
          name: 'Test Account',
          type: 'ASSET',
          balance: 5000.0,
          interestRate: 150.0, // Over 100%
        };

        const result = createAccountSchema.safeParse(invalidAccount);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('too high');
        }
      });

      it('should apply default currency if not provided', () => {
        const account = {
          name: 'Test Account',
          type: 'ASSET',
          balance: 5000.0,
        };

        const result = createAccountSchema.safeParse(account);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.currency).toBe('USD');
        }
      });
    });

    describe('updateAccountSchema', () => {
      it('should validate a valid account update', () => {
        const validUpdate = {
          name: 'Updated Name',
          balance: 6000.0,
        };

        const result = updateAccountSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const partialUpdate = {
          balance: 6000.0,
        };

        const result = updateAccountSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
      });

      it('should reject invalid field values', () => {
        const invalidUpdate = {
          interestRate: -10.0,
        };

        const result = updateAccountSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Transaction Validation', () => {
    describe('createTransactionSchema', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const validCategoryUuid = '223e4567-e89b-12d3-a456-426614174001';

      it('should validate a valid transaction creation', () => {
        const validTransaction = {
          accountId: validUuid,
          categoryId: validCategoryUuid,
          amount: 50.0,
          type: 'EXPENSE',
          description: 'Grocery shopping',
          date: new Date('2024-01-15'),
        };

        const result = createTransactionSchema.safeParse(validTransaction);
        expect(result.success).toBe(true);
      });

      it('should reject transaction with invalid account ID', () => {
        const invalidTransaction = {
          accountId: 'not-a-uuid',
          amount: 50.0,
          type: 'EXPENSE',
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(invalidTransaction);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid account ID');
        }
      });

      it('should reject transaction with invalid amount', () => {
        const invalidTransaction = {
          accountId: validUuid,
          amount: -50.0, // Negative not allowed
          type: 'EXPENSE',
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(invalidTransaction);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('positive');
        }
      });

      it('should reject transaction with zero amount', () => {
        const invalidTransaction = {
          accountId: validUuid,
          amount: 0,
          type: 'EXPENSE',
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(invalidTransaction);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('positive');
        }
      });

      it('should reject transaction with invalid type', () => {
        const invalidTransaction = {
          accountId: validUuid,
          amount: 50.0,
          type: 'INVALID',
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(invalidTransaction);
        expect(result.success).toBe(false);
      });

      it('should reject transaction with description longer than 200 characters', () => {
        const invalidTransaction = {
          accountId: validUuid,
          amount: 50.0,
          type: 'EXPENSE',
          description: 'A'.repeat(201),
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(invalidTransaction);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('too long');
        }
      });

      it('should allow transactions without category', () => {
        const validTransaction = {
          accountId: validUuid,
          amount: 50.0,
          type: 'EXPENSE',
          date: new Date(),
        };

        const result = createTransactionSchema.safeParse(validTransaction);
        expect(result.success).toBe(true);
      });
    });

    describe('updateTransactionSchema', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      it('should validate a valid transaction update', () => {
        const validUpdate = {
          amount: 75.0,
          description: 'Updated description',
        };

        const result = updateTransactionSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const partialUpdate = {
          categoryId: validUuid,
        };

        const result = updateTransactionSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Category Validation', () => {
    describe('createCategorySchema', () => {
      it('should validate a valid category creation', () => {
        const validCategory = {
          name: 'Groceries',
          type: 'EXPENSE',
          color: '#FF5733',
          icon: 'shopping_cart',
        };

        const result = createCategorySchema.safeParse(validCategory);
        expect(result.success).toBe(true);
      });

      it('should reject category with empty name', () => {
        const invalidCategory = {
          name: '',
          type: 'EXPENSE',
        };

        const result = createCategorySchema.safeParse(invalidCategory);
        expect(result.success).toBe(false);
      });

      it('should reject category with invalid color format', () => {
        const invalidCategory = {
          name: 'Groceries',
          type: 'EXPENSE',
          color: 'red', // Must be hex format
        };

        const result = createCategorySchema.safeParse(invalidCategory);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('hex');
        }
      });

      it('should accept valid 6-character hex color formats', () => {
        const testCases = [
          { name: 'Test1', type: 'EXPENSE', color: '#FFFFFF' },
          { name: 'Test2', type: 'EXPENSE', color: '#ffffff' },
          { name: 'Test3', type: 'EXPENSE', color: '#1A73E8' },
          { name: 'Test4', type: 'EXPENSE', color: '#00ff00' },
        ];

        testCases.forEach((testCase) => {
          const result = createCategorySchema.safeParse(testCase);
          expect(result.success).toBe(true);
        });
      });

      it('should reject 3-character hex color codes', () => {
        const invalidCategory = {
          name: 'Test',
          type: 'EXPENSE',
          color: '#FFF', // Must be 6 characters
        };

        const result = createCategorySchema.safeParse(invalidCategory);
        expect(result.success).toBe(false);
      });

      it('should reject category with invalid type', () => {
        const invalidCategory = {
          name: 'Test',
          type: 'INVALID',
        };

        const result = createCategorySchema.safeParse(invalidCategory);
        expect(result.success).toBe(false);
      });
    });

    describe('updateCategorySchema', () => {
      it('should validate a valid category update', () => {
        const validUpdate = {
          name: 'Updated Name',
          color: '#00FF00',
        };

        const result = updateCategorySchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const partialUpdate = {
          icon: 'new_icon',
        };

        const result = updateCategorySchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Budget Validation', () => {
    describe('createBudgetSchema', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      it('should validate a valid budget creation', () => {
        const validBudget = {
          categoryId: validUuid,
          amount: 500.0,
          period: 'MONTHLY',
          startDate: new Date('2024-01-01'),
        };

        const result = createBudgetSchema.safeParse(validBudget);
        expect(result.success).toBe(true);
      });

      it('should reject budget with negative amount', () => {
        const invalidBudget = {
          categoryId: validUuid,
          amount: -100.0,
          period: 'MONTHLY',
          startDate: new Date(),
        };

        const result = createBudgetSchema.safeParse(invalidBudget);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('positive');
        }
      });

      it('should reject budget with zero amount', () => {
        const invalidBudget = {
          categoryId: validUuid,
          amount: 0,
          period: 'MONTHLY',
          startDate: new Date(),
        };

        const result = createBudgetSchema.safeParse(invalidBudget);
        expect(result.success).toBe(false);
      });

      it('should reject budget with invalid period', () => {
        const invalidBudget = {
          categoryId: validUuid,
          amount: 500.0,
          period: 'INVALID',
          startDate: new Date(),
        };

        const result = createBudgetSchema.safeParse(invalidBudget);
        expect(result.success).toBe(false);
      });

      it('should reject budget with end date before or equal to start date', () => {
        const invalidBudget = {
          categoryId: validUuid,
          amount: 500.0,
          period: 'MONTHLY',
          startDate: new Date('2024-12-31'),
          endDate: new Date('2024-12-30'),
        };

        const result = createBudgetSchema.safeParse(invalidBudget);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('before');
        }
      });
    });

    describe('updateBudgetSchema', () => {
      it('should validate a valid budget update', () => {
        const validUpdate = {
          amount: 600.0,
          isActive: false,
        };

        const result = updateBudgetSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const partialUpdate = {
          isActive: true,
        };

        const result = updateBudgetSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Projection Validation', () => {
    describe('createProjectionSchema', () => {
      it('should validate a valid projection creation', () => {
        const validProjection = {
          name: '30-Year Retirement Plan',
          description: 'Conservative estimate',
          incomeGrowthRate: 3.0,
          investmentReturn: 7.0,
          inflationRate: 2.5,
        };

        const result = createProjectionSchema.safeParse(validProjection);
        expect(result.success).toBe(true);
      });

      it('should reject projection with empty name', () => {
        const invalidProjection = {
          name: '',
          incomeGrowthRate: 3.0,
          investmentReturn: 7.0,
          inflationRate: 2.5,
        };

        const result = createProjectionSchema.safeParse(invalidProjection);
        expect(result.success).toBe(false);
      });

      it('should reject projection with extremely low income growth rate', () => {
        const invalidProjection = {
          name: 'Test Projection',
          incomeGrowthRate: -150.0, // Below -100
          investmentReturn: 7.0,
          inflationRate: 2.5,
        };

        const result = createProjectionSchema.safeParse(invalidProjection);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('too low');
        }
      });

      it('should reject projection with unrealistic investment return', () => {
        const invalidProjection = {
          name: 'Test Projection',
          incomeGrowthRate: 3.0,
          investmentReturn: 150.0, // Over 100%
          inflationRate: 2.5,
        };

        const result = createProjectionSchema.safeParse(invalidProjection);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('too high');
        }
      });

      it('should reject projection with extremely low inflation rate', () => {
        const invalidProjection = {
          name: 'Test Projection',
          incomeGrowthRate: 3.0,
          investmentReturn: 7.0,
          inflationRate: -15.0, // Below -10
        };

        const result = createProjectionSchema.safeParse(invalidProjection);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('too low');
        }
      });

      it('should allow reasonable negative values', () => {
        const validProjection = {
          name: 'Recession Scenario',
          incomeGrowthRate: -2.0, // Allowed (within -100 to 100 range)
          investmentReturn: -5.0, // Allowed (within -100 to 100 range)
          inflationRate: -1.0, // Allowed (within -10 to 50 range)
        };

        const result = createProjectionSchema.safeParse(validProjection);
        expect(result.success).toBe(true);
      });

      it('should allow projection without description', () => {
        const validProjection = {
          name: 'Simple Projection',
          incomeGrowthRate: 3.0,
          investmentReturn: 7.0,
          inflationRate: 2.5,
        };

        const result = createProjectionSchema.safeParse(validProjection);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should handle very large valid amounts', () => {
      const largeAmount = {
        accountId: validUuid,
        amount: 999999999.99,
        type: 'EXPENSE',
        date: new Date(),
      };

      const result = createTransactionSchema.safeParse(largeAmount);
      expect(result.success).toBe(true);
    });

    it('should handle very small valid amounts', () => {
      const smallAmount = {
        accountId: validUuid,
        amount: 0.01,
        type: 'EXPENSE',
        date: new Date(),
      };

      const result = createTransactionSchema.safeParse(smallAmount);
      expect(result.success).toBe(true);
    });

    it('should handle maximum length strings', () => {
      const maxLengthAccount = {
        name: 'A'.repeat(100), // Max allowed
        type: 'ASSET',
        balance: 1000.0,
      };

      const result = createAccountSchema.safeParse(maxLengthAccount);
      expect(result.success).toBe(true);
    });

    it('should reject strings exceeding maximum length', () => {
      const tooLongAccount = {
        name: 'A'.repeat(101), // Over max
        type: 'ASSET',
        balance: 1000.0,
      };

      const result = createAccountSchema.safeParse(tooLongAccount);
      expect(result.success).toBe(false);
    });
  });
});
