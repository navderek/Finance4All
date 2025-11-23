import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # ============================================
  # SCALARS
  # ============================================
  scalar DateTime
  scalar Decimal

  # ============================================
  # USER TYPES
  # ============================================

  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: ID!
    firebaseUid: String!
    email: String!
    displayName: String
    photoUrl: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    firebaseUid: String!
    email: String!
    displayName: String
    photoUrl: String
  }

  input UpdateUserInput {
    displayName: String
    photoUrl: String
  }

  # ============================================
  # ACCOUNT TYPES
  # ============================================

  enum AccountType {
    ASSET
    INVESTMENT
    DEBT
    LIABILITY
  }

  type Account {
    id: ID!
    userId: String!
    name: String!
    type: AccountType!
    subtype: String
    balance: Decimal!
    currency: String!
    institution: String
    accountNumber: String
    interestRate: Decimal
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    transactions: [Transaction!]!
  }

  input CreateAccountInput {
    name: String!
    type: AccountType!
    subtype: String
    balance: Decimal!
    currency: String
    institution: String
    accountNumber: String
    interestRate: Decimal
  }

  input UpdateAccountInput {
    name: String
    type: AccountType
    subtype: String
    balance: Decimal
    currency: String
    institution: String
    accountNumber: String
    interestRate: Decimal
    isActive: Boolean
  }

  input AccountFilterInput {
    type: AccountType
    isActive: Boolean
  }

  # ============================================
  # CATEGORY TYPES
  # ============================================

  enum CategoryType {
    INCOME
    EXPENSE
  }

  type Category {
    id: ID!
    userId: String!
    name: String!
    type: CategoryType!
    color: String
    icon: String
    isDefault: Boolean!
    parentId: String
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    parent: Category
    children: [Category!]!
    transactions: [Transaction!]!
  }

  input CreateCategoryInput {
    name: String!
    type: CategoryType!
    color: String
    icon: String
    parentId: String
  }

  input UpdateCategoryInput {
    name: String
    type: CategoryType
    color: String
    icon: String
    parentId: String
  }

  # ============================================
  # TRANSACTION TYPES
  # ============================================

  enum TransactionType {
    INCOME
    EXPENSE
    TRANSFER
  }

  type Transaction {
    id: ID!
    userId: String!
    accountId: String!
    categoryId: String
    amount: Decimal!
    type: TransactionType!
    description: String
    notes: String
    date: DateTime!
    isRecurring: Boolean!
    recurringId: String
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    account: Account!
    category: Category
  }

  input CreateTransactionInput {
    accountId: String!
    categoryId: String
    amount: Decimal!
    type: TransactionType!
    description: String
    notes: String
    date: DateTime!
    isRecurring: Boolean
    recurringId: String
  }

  input UpdateTransactionInput {
    accountId: String
    categoryId: String
    amount: Decimal
    type: TransactionType
    description: String
    notes: String
    date: DateTime
    isRecurring: Boolean
    recurringId: String
  }

  input TransactionFilterInput {
    accountId: String
    categoryId: String
    type: TransactionType
    startDate: DateTime
    endDate: DateTime
    minAmount: Decimal
    maxAmount: Decimal
  }

  input PaginationInput {
    offset: Int
    limit: Int
  }

  type TransactionConnection {
    transactions: [Transaction!]!
    total: Int!
    hasMore: Boolean!
  }

  # ============================================
  # QUERY
  # ============================================

  type Query {
    # Health check
    hello: String!

    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # Account queries
    accounts(filter: AccountFilterInput): [Account!]!
    account(id: ID!): Account

    # Category queries
    categories(type: CategoryType): [Category!]!
    category(id: ID!): Category

    # Transaction queries
    transactions(
      filter: TransactionFilterInput
      pagination: PaginationInput
    ): TransactionConnection!
    transaction(id: ID!): Transaction
  }

  # ============================================
  # MUTATION
  # ============================================

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser: Boolean!

    # Account mutations
    createAccount(input: CreateAccountInput!): Account!
    updateAccount(id: ID!, input: UpdateAccountInput!): Account!
    deleteAccount(id: ID!): Boolean!

    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    # Transaction mutations
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
    bulkCreateTransactions(inputs: [CreateTransactionInput!]!): [Transaction!]!
  }
`;
