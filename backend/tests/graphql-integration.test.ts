import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../src/graphql/schema';
import { resolvers } from '../src/graphql/resolvers';
import { GraphQLContext } from '../src/graphql/context';
import { PrismaClient } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/auth';

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  account: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  budget: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  projection: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

// Mock authenticated user
const mockUser = {
  uid: 'test-firebase-uid-123',
  email: 'test@finance4all.com',
  email_verified: true,
  auth_time: Date.now(),
  iat: Date.now(),
  exp: Date.now() + 3600,
  aud: 'test-project',
  iss: 'https://securetoken.google.com/test-project',
  sub: 'test-firebase-uid-123',
  firebase: {
    sign_in_provider: 'password',
    identities: {},
  },
} as DecodedIdToken;

// Mock database user
const mockDbUser = {
  id: 'user-uuid-123',
  firebaseUid: 'test-firebase-uid-123',
  email: 'test@finance4all.com',
  displayName: 'Test User',
  photoUrl: null,
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GraphQL Integration Tests', () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(() => {
    server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Queries', () => {
    it('should get current user profile', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);

      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
                displayName
                role
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.me).toMatchObject({
          email: 'test@finance4all.com',
          displayName: 'Test User',
          role: 'USER',
        });
      }
    });

    it('should return error when not authenticated', async () => {
      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: null,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors?.[0].message).toContain('Not authenticated');
      }
    });
  });

  describe('Account Queries and Mutations', () => {
    const mockAccount = {
      id: 'account-123',
      userId: 'user-uuid-123',
      name: 'Main Checking',
      type: 'ASSET',
      subtype: 'Checking',
      balance: 5000.0,
      currency: 'USD',
      institution: 'Test Bank',
      accountNumber: null,
      interestRate: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);
    });

    it('should get all accounts for user', async () => {
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue([mockAccount]);

      const response = await server.executeOperation(
        {
          query: `
            query {
              accounts {
                id
                name
                type
                balance
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data as any;
        expect(data?.accounts).toHaveLength(1);
        expect(data?.accounts[0]).toMatchObject({
          name: 'Main Checking',
          type: 'ASSET',
          balance: 5000,
        });
      }
    });

    it('should get account by id', async () => {
      (mockPrisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const response = await server.executeOperation(
        {
          query: `
            query GetAccount($id: ID!) {
              account(id: $id) {
                id
                name
                type
                balance
              }
            }
          `,
          variables: { id: 'account-123' },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.account).toMatchObject({
          name: 'Main Checking',
          type: 'ASSET',
        });
      }
    });

    it('should create a new account', async () => {
      (mockPrisma.account.create as jest.Mock).mockResolvedValue(mockAccount);

      const response = await server.executeOperation(
        {
          query: `
            mutation CreateAccount($input: CreateAccountInput!) {
              createAccount(input: $input) {
                id
                name
                type
                balance
              }
            }
          `,
          variables: {
            input: {
              name: 'Main Checking',
              type: 'ASSET',
              subtype: 'Checking',
              balance: 5000.0,
              currency: 'USD',
              institution: 'Test Bank',
            },
          },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.createAccount).toMatchObject({
          name: 'Main Checking',
          type: 'ASSET',
          balance: 5000,
        });
      }
    });

    it('should update an account', async () => {
      const updatedAccount = { ...mockAccount, balance: 6000.0 };
      (mockPrisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (mockPrisma.account.update as jest.Mock).mockResolvedValue(updatedAccount);

      const response = await server.executeOperation(
        {
          query: `
            mutation UpdateAccount($id: ID!, $input: UpdateAccountInput!) {
              updateAccount(id: $id, input: $input) {
                id
                balance
              }
            }
          `,
          variables: {
            id: 'account-123',
            input: { balance: 6000.0 },
          },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data as any;
        expect(data?.updateAccount.balance).toBe(6000);
      }
    });

    it('should delete an account', async () => {
      (mockPrisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (mockPrisma.account.delete as jest.Mock).mockResolvedValue(mockAccount);

      const response = await server.executeOperation(
        {
          query: `
            mutation DeleteAccount($id: ID!) {
              deleteAccount(id: $id)
            }
          `,
          variables: { id: 'account-123' },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.deleteAccount).toBe(true);
      }
    });

    it('should not allow deleting another users account', async () => {
      const otherUsersAccount = { ...mockAccount, userId: 'other-user-id' };
      (mockPrisma.account.findUnique as jest.Mock).mockResolvedValue(otherUsersAccount);

      const response = await server.executeOperation(
        {
          query: `
            mutation DeleteAccount($id: ID!) {
              deleteAccount(id: $id)
            }
          `,
          variables: { id: 'account-123' },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors?.[0].message).toContain('Forbidden');
      }
    });
  });

  describe('Transaction Queries and Mutations', () => {
    const validAccountUuid = '123e4567-e89b-12d3-a456-426614174000';
    const validCategoryUuid = '223e4567-e89b-12d3-a456-426614174001';

    const mockCategory = {
      id: validCategoryUuid,
      userId: 'user-uuid-123',
      name: 'Groceries',
      type: 'EXPENSE',
      color: '#FF0000',
      icon: 'shopping_cart',
      isDefault: false,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTransaction = {
      id: 'txn-uuid-123',
      userId: 'user-uuid-123',
      accountId: validAccountUuid,
      categoryId: validCategoryUuid,
      amount: 50.0,
      type: 'EXPENSE',
      description: 'Grocery shopping',
      notes: null,
      date: new Date('2024-01-15'),
      isRecurring: false,
      recurringId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: mockCategory,
    };

    beforeEach(() => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);
    });

    it('should get all transactions for user', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([mockTransaction]);
      (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(1);

      const response = await server.executeOperation(
        {
          query: `
            query {
              transactions {
                transactions {
                  id
                  amount
                  type
                  description
                  category {
                    name
                  }
                }
                total
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data as any;
        expect(data?.transactions.transactions).toHaveLength(1);
        expect(data?.transactions.transactions[0]).toMatchObject({
          amount: 50,
          type: 'EXPENSE',
          description: 'Grocery shopping',
        });
      }
    });

    it('should create a new transaction', async () => {
      (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const response = await server.executeOperation(
        {
          query: `
            mutation CreateTransaction($input: CreateTransactionInput!) {
              createTransaction(input: $input) {
                id
                amount
                type
                description
              }
            }
          `,
          variables: {
            input: {
              accountId: validAccountUuid,
              categoryId: validCategoryUuid,
              amount: 50.0,
              type: 'EXPENSE',
              description: 'Grocery shopping',
              date: '2024-01-15T00:00:00Z',
            },
          },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.createTransaction).toMatchObject({
          amount: 50,
          type: 'EXPENSE',
          description: 'Grocery shopping',
        });
      }
    });

    it('should filter transactions by type', async () => {
      const expenseTransactions = [mockTransaction];
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(expenseTransactions);
      (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(1);

      const response = await server.executeOperation(
        {
          query: `
            query GetTransactions($type: TransactionType) {
              transactions(type: $type) {
                id
                type
              }
            }
          `,
          variables: { type: 'EXPENSE' },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              type: 'EXPENSE',
            }),
          })
        );
      }
    });
  });

  describe('Category Queries and Mutations', () => {
    const mockCategory = {
      id: 'cat-123',
      userId: 'user-uuid-123',
      name: 'Groceries',
      type: 'EXPENSE',
      color: '#FF0000',
      icon: 'shopping_cart',
      isDefault: false,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);
    });

    it('should get all categories for user', async () => {
      (mockPrisma.category.findMany as jest.Mock).mockResolvedValue([mockCategory]);

      const response = await server.executeOperation(
        {
          query: `
            query {
              categories {
                id
                name
                type
                color
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data as any;
        expect(data?.categories).toHaveLength(1);
        expect(data?.categories[0]).toMatchObject({
          name: 'Groceries',
          type: 'EXPENSE',
        });
      }
    });

    it('should create a new category', async () => {
      (mockPrisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const response = await server.executeOperation(
        {
          query: `
            mutation CreateCategory($input: CreateCategoryInput!) {
              createCategory(input: $input) {
                id
                name
                type
              }
            }
          `,
          variables: {
            input: {
              name: 'Groceries',
              type: 'EXPENSE',
              color: '#FF0000',
              icon: 'shopping_cart',
            },
          },
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.createCategory).toMatchObject({
          name: 'Groceries',
          type: 'EXPENSE',
        });
      }
    });
  });

  describe('Calculation Queries', () => {
    beforeEach(() => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);
    });

    it('should calculate net worth', async () => {
      const mockAccounts = [
        { id: '1', name: 'Checking', type: 'ASSET', balance: 5000 },
        { id: '2', name: 'Investment', type: 'INVESTMENT', balance: 10000 },
      ];
      (mockPrisma.account.findMany as jest.Mock).mockResolvedValue(mockAccounts);

      const response = await server.executeOperation(
        {
          query: `
            query {
              netWorth {
                totalAssets
                totalInvestments
                netWorth
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.netWorth).toMatchObject({
          totalAssets: 5000,
          totalInvestments: 10000,
          netWorth: 15000,
        });
      }
    });

    it('should calculate cash flow', async () => {
      const mockTransactions = [
        {
          id: '1',
          userId: 'user-uuid-123',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          amount: 5000,
          type: 'INCOME',
          date: new Date('2024-01-15'),
          category: { id: 'cat-1', name: 'Salary' },
        },
        {
          id: '2',
          userId: 'user-uuid-123',
          accountId: 'acc-1',
          categoryId: 'cat-2',
          amount: 1500,
          type: 'EXPENSE',
          date: new Date('2024-01-10'),
          category: { id: 'cat-2', name: 'Rent' },
        },
      ];
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const response = await server.executeOperation(
        {
          query: `
            query {
              cashFlow {
                totalIncome
                totalExpenses
                netCashFlow
              }
            }
          `,
        },
        {
          contextValue: {
            prisma: mockPrisma,
            user: mockUser,
            req: {} as any,
            res: {} as any,
          },
        }
      );

      expect(response.body.kind).toBe('single');
      if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.cashFlow).toMatchObject({
          totalIncome: 5000,
          totalExpenses: 1500,
          netCashFlow: 3500,
        });
      }
    });
  });
});
