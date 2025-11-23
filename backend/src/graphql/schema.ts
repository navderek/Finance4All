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
  # QUERY
  # ============================================

  type Query {
    # Health check
    hello: String!

    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  # ============================================
  # MUTATION
  # ============================================

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser: Boolean!
  }
`;
