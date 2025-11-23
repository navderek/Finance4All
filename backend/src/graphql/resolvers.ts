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
  },
};
