import {
  calculateNetWorth,
  calculateCashFlow,
  calculate30YearProjection,
  getDateRange,
  getCurrentMonthRange,
  getYearToDateRange,
} from '../src/utils/calculations';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
const mockPrisma = {
  account: {
    findMany: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Financial Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateNetWorth', () => {
    it('should calculate net worth correctly with mixed account types', async () => {
      const mockAccounts = [
        { id: '1', name: 'Checking', type: 'ASSET', balance: 5000 },
        { id: '2', name: '401k', type: 'INVESTMENT', balance: 50000 },
        { id: '3', name: 'Credit Card', type: 'DEBT', balance: -2000 },
        { id: '4', name: 'Mortgage', type: 'LIABILITY', balance: -200000 },
      ];

      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await calculateNetWorth(mockPrisma, 'user-123');

      expect(result.totalAssets).toBe(5000);
      expect(result.totalInvestments).toBe(50000);
      expect(result.totalDebts).toBe(2000);
      expect(result.totalLiabilities).toBe(200000);
      expect(result.netWorth).toBe(55000 - 202000); // -147,000
      expect(result.accounts).toHaveLength(4);
    });

    it('should handle zero balances', async () => {
      const mockAccounts = [
        { id: '1', name: 'Empty Account', type: 'ASSET', balance: 0 },
      ];

      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await calculateNetWorth(mockPrisma, 'user-123');

      expect(result.netWorth).toBe(0);
      expect(result.totalAssets).toBe(0);
    });

    it('should handle only assets (no debts)', async () => {
      const mockAccounts = [
        { id: '1', name: 'Savings', type: 'ASSET', balance: 10000 },
        { id: '2', name: 'Stocks', type: 'INVESTMENT', balance: 25000 },
      ];

      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await calculateNetWorth(mockPrisma, 'user-123');

      expect(result.netWorth).toBe(35000);
      expect(result.totalDebts).toBe(0);
      expect(result.totalLiabilities).toBe(0);
    });

    it('should include calculatedAt timestamp', async () => {
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue([]);

      const before = new Date();
      const result = await calculateNetWorth(mockPrisma, 'user-123');
      const after = new Date();

      expect(result.calculatedAt).toBeInstanceOf(Date);
      expect(result.calculatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.calculatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('calculateCashFlow', () => {
    it('should calculate cash flow correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const mockTransactions = [
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-salary',
          amount: 5000,
          type: 'INCOME',
          date: new Date('2024-01-15'),
          category: { id: 'cat-salary', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-rent',
          amount: 1500,
          type: 'EXPENSE',
          date: new Date('2024-01-01'),
          category: { id: 'cat-rent', name: 'Rent' },
        },
        {
          id: '3',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-food',
          amount: 500,
          type: 'EXPENSE',
          date: new Date('2024-01-10'),
          category: { id: 'cat-food', name: 'Food' },
        },
      ];

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await calculateCashFlow(mockPrisma, 'user-123', startDate, endDate);

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpenses).toBe(2000); // 1500 + 500
      expect(result.netCashFlow).toBe(3000); // 5000 - 2000
      expect(result.period.startDate).toEqual(startDate);
      expect(result.period.endDate).toEqual(endDate);
    });

    it('should group by category correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockTransactions = [
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-salary',
          amount: 5000,
          type: 'INCOME',
          date: new Date('2024-01-15'),
          category: { id: 'cat-salary', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-salary',
          amount: 1000,
          type: 'INCOME',
          date: new Date('2024-01-20'),
          category: { id: 'cat-salary', name: 'Salary' },
        },
        {
          id: '3',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-food',
          amount: 300,
          type: 'EXPENSE',
          date: new Date('2024-01-05'),
          category: { id: 'cat-food', name: 'Food' },
        },
        {
          id: '4',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-food',
          amount: 200,
          type: 'EXPENSE',
          date: new Date('2024-01-15'),
          category: { id: 'cat-food', name: 'Food' },
        },
      ];

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await calculateCashFlow(mockPrisma, 'user-123', startDate, endDate);

      expect(result.incomeByCategory).toHaveLength(1);
      expect(result.incomeByCategory[0]).toMatchObject({
        categoryId: 'cat-salary',
        categoryName: 'Salary',
        amount: 6000, // 5000 + 1000
      });

      expect(result.expensesByCategory).toHaveLength(1);
      expect(result.expensesByCategory[0]).toMatchObject({
        categoryId: 'cat-food',
        categoryName: 'Food',
        amount: 500, // 300 + 200
      });
    });

    it('should handle uncategorized transactions', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockTransactions = [
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: null,
          amount: 100,
          type: 'EXPENSE',
          date: new Date('2024-01-15'),
          category: null,
        },
      ];

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await calculateCashFlow(mockPrisma, 'user-123', startDate, endDate);

      expect(result.expensesByCategory).toHaveLength(1);
      expect(result.expensesByCategory[0]).toMatchObject({
        categoryId: null,
        categoryName: 'Uncategorized',
        amount: 100,
      });
    });

    it('should create monthly breakdown correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');

      const mockTransactions = [
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 1000,
          type: 'INCOME',
          date: new Date('2024-01-15'),
          category: { id: 'cat-1', name: 'Income' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-2',
          amount: 500,
          type: 'EXPENSE',
          date: new Date('2024-01-20'),
          category: { id: 'cat-2', name: 'Expense' },
        },
        {
          id: '3',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 1000,
          type: 'INCOME',
          date: new Date('2024-02-15'),
          category: { id: 'cat-1', name: 'Income' },
        },
      ];

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await calculateCashFlow(mockPrisma, 'user-123', startDate, endDate);

      expect(result.monthlyBreakdown).toHaveLength(2); // Jan and Feb only
      expect(result.monthlyBreakdown[0]).toMatchObject({
        month: '2024-01',
        income: 1000,
        expenses: 500,
        netCashFlow: 500,
      });
      expect(result.monthlyBreakdown[1]).toMatchObject({
        month: '2024-02',
        income: 1000,
        expenses: 0,
        netCashFlow: 1000,
      });
    });
  });

  describe('calculate30YearProjection', () => {
    it('should project net worth growth over time', async () => {
      // Mock accounts
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Savings', type: 'ASSET', balance: 10000 },
        { id: '2', name: 'Investment', type: 'INVESTMENT', balance: 20000 },
      ]);

      // Mock transactions for cash flow
      const mockTransactions = [
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 60000, // Annual income
          type: 'INCOME',
          date: new Date('2023-12-01'),
          category: { id: 'cat-1', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-2',
          amount: 36000, // Annual expenses
          type: 'EXPENSE',
          date: new Date('2023-12-01'),
          category: { id: 'cat-2', name: 'Living' },
        },
      ];

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const assumptions = {
        incomeGrowthRate: 3.0,
        investmentReturn: 7.0,
        inflationRate: 2.5,
      };

      const result = await calculate30YearProjection(mockPrisma, 'user-123', assumptions, 30);

      expect(result.projectedYears).toHaveLength(31); // Year 0-30
      expect(result.currentNetWorth).toBe(30000);
      expect(result.projectedYears[0].year).toBe(0);
      expect(result.projectedYears[0].age).toBe(30);
      expect(result.projectedYears[30].year).toBe(30);
      expect(result.projectedYears[30].age).toBe(60);

      // Net worth should grow over time with positive savings
      expect(result.projectedYears[10].netWorth).toBeGreaterThan(result.projectedYears[0].netWorth);
      expect(result.projectedYears[20].netWorth).toBeGreaterThan(result.projectedYears[10].netWorth);
    });

    it('should detect milestones correctly', async () => {
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Investment', type: 'INVESTMENT', balance: 100000 },
      ]);

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 80000,
          type: 'INCOME',
          date: new Date('2023-12-01'),
          category: { id: 'cat-1', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-2',
          amount: 40000,
          type: 'EXPENSE',
          date: new Date('2023-12-01'),
          category: { id: 'cat-2', name: 'Living' },
        },
      ]);

      const assumptions = {
        incomeGrowthRate: 3.0,
        investmentReturn: 8.0, // Higher return for faster growth
        inflationRate: 2.0,
      };

      const result = await calculate30YearProjection(mockPrisma, 'user-123', assumptions);

      // With $100k starting, $40k annual savings, and 8% returns, should hit millionaire
      expect(result.milestones.millionaireYear).toBeDefined();
      expect(result.milestones.millionaireYear).toBeGreaterThan(0);
      expect(result.milestones.millionaireYear).toBeLessThanOrEqual(30);
    });

    it('should apply income growth correctly', async () => {
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Account', type: 'ASSET', balance: 1000 },
      ]);

      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 50000,
          type: 'INCOME',
          date: new Date('2023-12-01'),
          category: { id: 'cat-1', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-123',
          accountId: 'acc-1',
          categoryId: 'cat-2',
          amount: 30000,
          type: 'EXPENSE',
          date: new Date('2023-12-01'),
          category: { id: 'cat-2', name: 'Living' },
        },
      ]);

      const assumptions = {
        incomeGrowthRate: 5.0, // 5% annual raises
        investmentReturn: 7.0,
        inflationRate: 2.5,
      };

      const result = await calculate30YearProjection(mockPrisma, 'user-123', assumptions);

      // Income in year 0 should be ~50000
      expect(result.projectedYears[0].annualIncome).toBeCloseTo(50000, 0);

      // Income in year 1 should be 50000 * 1.05 = 52500
      expect(result.projectedYears[1].annualIncome).toBeCloseTo(52500, 0);

      // Income in year 10 should be significantly higher
      const expectedYear10Income = 50000 * Math.pow(1.05, 10);
      expect(result.projectedYears[10].annualIncome).toBeCloseTo(expectedYear10Income, 0);
    });
  });

  describe('Helper Functions', () => {
    describe('getDateRange', () => {
      it('should return correct date range for months', () => {
        const { startDate, endDate } = getDateRange(6);

        const monthsDiff =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());

        expect(monthsDiff).toBeCloseTo(6, 0);
        expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
      });
    });

    describe('getCurrentMonthRange', () => {
      it('should return start and end of current month', () => {
        const { startDate, endDate } = getCurrentMonthRange();
        const now = new Date();

        expect(startDate.getMonth()).toBe(now.getMonth());
        expect(startDate.getDate()).toBe(1);
        expect(startDate.getHours()).toBe(0);

        expect(endDate.getMonth()).toBe(now.getMonth());
        expect(endDate.getHours()).toBe(23);
        expect(endDate.getMinutes()).toBe(59);
      });
    });

    describe('getYearToDateRange', () => {
      it('should return from start of year to now', () => {
        const { startDate, endDate } = getYearToDateRange();
        const now = new Date();

        expect(startDate.getMonth()).toBe(0); // January
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getTime()).toBeLessThanOrEqual(now.getTime());
      });
    });
  });
});
