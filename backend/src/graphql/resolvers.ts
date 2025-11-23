import { GraphQLError } from 'graphql';
import { GraphQLContext } from './context';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom scalar for DateTime
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw Error('GraphQL DateTime Scalar serializer expected a `Date` object');
  },
  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Custom scalar for Decimal
const DecimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Decimal custom scalar type',
  serialize(value: any) {
    return parseFloat(value.toString());
  },
  parseValue(value: any) {
    return parseFloat(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
      return parseFloat(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  // Custom Scalars
  DateTime: DateTimeScalar,
  Decimal: DecimalScalar,

  // Queries
  Query: {
    hello: () => {
      return 'Welcome to Finance4All GraphQL API! 🚀';
    },

    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return user;
    },

    user: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { id: args.id },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Users can only query their own data (unless admin)
      if (user.firebaseUid !== context.user.uid && context.user.role !== 'ADMIN') {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return user;
    },

    users: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Only admins can list all users
      if (context.user.role !== 'ADMIN') {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return context.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },

    // Account queries
    accounts: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const where: any = { userId: currentUser.id };
      if (args.filter) {
        if (args.filter.type) where.type = args.filter.type;
        if (args.filter.isActive !== undefined) where.isActive = args.filter.isActive;
      }

      return context.prisma.account.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },

    account: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const account = await context.prisma.account.findUnique({
        where: { id: args.id },
      });

      if (!account) {
        throw new GraphQLError('Account not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Ensure user owns this account
      if (account.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return account;
    },

    // Category queries
    categories: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const where: any = { userId: currentUser.id };
      if (args.type) where.type = args.type;

      return context.prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
      });
    },

    category: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const category = await context.prisma.category.findUnique({
        where: { id: args.id },
      });

      if (!category) {
        throw new GraphQLError('Category not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (category.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return category;
    },

    // Transaction queries
    transactions: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const where: any = { userId: currentUser.id };

      // Apply filters
      if (args.filter) {
        if (args.filter.accountId) where.accountId = args.filter.accountId;
        if (args.filter.categoryId) where.categoryId = args.filter.categoryId;
        if (args.filter.type) where.type = args.filter.type;
        if (args.filter.startDate || args.filter.endDate) {
          where.date = {};
          if (args.filter.startDate) where.date.gte = args.filter.startDate;
          if (args.filter.endDate) where.date.lte = args.filter.endDate;
        }
        if (args.filter.minAmount || args.filter.maxAmount) {
          where.amount = {};
          if (args.filter.minAmount) where.amount.gte = args.filter.minAmount;
          if (args.filter.maxAmount) where.amount.lte = args.filter.maxAmount;
        }
      }

      // Pagination
      const offset = args.pagination?.offset || 0;
      const limit = args.pagination?.limit || 50;

      const [transactions, total] = await Promise.all([
        context.prisma.transaction.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { date: 'desc' },
        }),
        context.prisma.transaction.count({ where }),
      ]);

      return {
        transactions,
        total,
        hasMore: offset + transactions.length < total,
      };
    },

    transaction: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const transaction = await context.prisma.transaction.findUnique({
        where: { id: args.id },
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (transaction.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return transaction;
    },
  },

  // Mutations
  Mutation: {
    createUser: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user already exists
      const existingUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (existingUser) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'USER_ALREADY_EXISTS' },
        });
      }

      // Create user
      const user = await context.prisma.user.create({
        data: {
          firebaseUid: args.input.firebaseUid,
          email: args.input.email,
          displayName: args.input.displayName,
          photoUrl: args.input.photoUrl,
          role: 'USER',
        },
      });

      return user;
    },

    updateUser: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Find user
      const user = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Update user
      const updatedUser = await context.prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: args.input.displayName ?? user.displayName,
          photoUrl: args.input.photoUrl ?? user.photoUrl,
        },
      });

      return updatedUser;
    },

    deleteUser: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Find user
      const user = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Delete user (cascade will delete related data)
      await context.prisma.user.delete({
        where: { id: user.id },
      });

      return true;
    },

    // Account mutations
    createAccount: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return context.prisma.account.create({
        data: {
          userId: currentUser.id,
          name: args.input.name,
          type: args.input.type,
          subtype: args.input.subtype,
          balance: args.input.balance,
          currency: args.input.currency || 'USD',
          institution: args.input.institution,
          accountNumber: args.input.accountNumber,
          interestRate: args.input.interestRate,
        },
      });
    },

    updateAccount: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const account = await context.prisma.account.findUnique({
        where: { id: args.id },
      });

      if (!account) {
        throw new GraphQLError('Account not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (account.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return context.prisma.account.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteAccount: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const account = await context.prisma.account.findUnique({
        where: { id: args.id },
      });

      if (!account) {
        throw new GraphQLError('Account not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (account.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.account.delete({
        where: { id: args.id },
      });

      return true;
    },

    // Category mutations
    createCategory: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return context.prisma.category.create({
        data: {
          userId: currentUser.id,
          name: args.input.name,
          type: args.input.type,
          color: args.input.color,
          icon: args.input.icon,
          parentId: args.input.parentId,
        },
      });
    },

    updateCategory: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const category = await context.prisma.category.findUnique({
        where: { id: args.id },
      });

      if (!category) {
        throw new GraphQLError('Category not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (category.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return context.prisma.category.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteCategory: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const category = await context.prisma.category.findUnique({
        where: { id: args.id },
      });

      if (!category) {
        throw new GraphQLError('Category not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (category.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.category.delete({
        where: { id: args.id },
      });

      return true;
    },

    // Transaction mutations
    createTransaction: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Verify account ownership
      const account = await context.prisma.account.findUnique({
        where: { id: args.input.accountId },
      });

      if (!account || account.userId !== currentUser.id) {
        throw new GraphQLError('Account not found or forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return context.prisma.transaction.create({
        data: {
          userId: currentUser.id,
          accountId: args.input.accountId,
          categoryId: args.input.categoryId,
          amount: args.input.amount,
          type: args.input.type,
          description: args.input.description,
          notes: args.input.notes,
          date: args.input.date,
          isRecurring: args.input.isRecurring || false,
          recurringId: args.input.recurringId,
        },
      });
    },

    updateTransaction: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const transaction = await context.prisma.transaction.findUnique({
        where: { id: args.id },
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (transaction.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return context.prisma.transaction.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteTransaction: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const transaction = await context.prisma.transaction.findUnique({
        where: { id: args.id },
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (transaction.userId !== currentUser.id) {
        throw new GraphQLError('Forbidden', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.transaction.delete({
        where: { id: args.id },
      });

      return true;
    },

    bulkCreateTransactions: async (_parent: any, args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const currentUser = await context.prisma.user.findUnique({
        where: { firebaseUid: context.user.uid },
      });

      if (!currentUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Create all transactions
      const transactions = await Promise.all(
        args.inputs.map((input: any) =>
          context.prisma.transaction.create({
            data: {
              userId: currentUser.id,
              accountId: input.accountId,
              categoryId: input.categoryId,
              amount: input.amount,
              type: input.type,
              description: input.description,
              notes: input.notes,
              date: input.date,
              isRecurring: input.isRecurring || false,
              recurringId: input.recurringId,
            },
          })
        )
      );

      return transactions;
    },
  },

  // Type resolvers for relationships
  Account: {
    user: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    transactions: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.transaction.findMany({
        where: { accountId: parent.id },
        orderBy: { date: 'desc' },
      });
    },
  },

  Category: {
    user: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    parent: async (parent: any, _args: any, context: GraphQLContext) => {
      if (!parent.parentId) return null;
      return context.prisma.category.findUnique({
        where: { id: parent.parentId },
      });
    },
    children: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.category.findMany({
        where: { parentId: parent.id },
      });
    },
    transactions: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.transaction.findMany({
        where: { categoryId: parent.id },
        orderBy: { date: 'desc' },
      });
    },
  },

  Transaction: {
    user: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    account: async (parent: any, _args: any, context: GraphQLContext) => {
      return context.prisma.account.findUnique({
        where: { id: parent.accountId },
      });
    },
    category: async (parent: any, _args: any, context: GraphQLContext) => {
      if (!parent.categoryId) return null;
      return context.prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },
  },
};
