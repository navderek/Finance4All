import request from 'supertest';
import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../src/graphql/schema';
import { resolvers } from '../src/graphql/resolvers';
import { createContext, GraphQLContext } from '../src/graphql/context';

describe('GraphQL API', () => {
  let app: express.Application;
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    // Create Express app
    app = express();
    app.use(express.json());

    // Create Apollo Server
    server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
    });

    await server.start();

    // Add GraphQL middleware
    app.use('/graphql', expressMiddleware(server, { context: createContext }));
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Query: hello', () => {
    it('should return welcome message', async () => {
      const query = `
        query {
          hello
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.hello).toBe('Welcome to Finance4All GraphQL API! 🚀');
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Query: me (unauthenticated)', () => {
    it('should return UNAUTHENTICATED error when no token provided', async () => {
      const query = `
        query {
          me {
            id
            email
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Mutation: createUser (unauthenticated)', () => {
    it('should return UNAUTHENTICATED error when no token provided', async () => {
      const mutation = `
        mutation {
          createUser(input: {
            firebaseUid: "test-uid"
            email: "test@example.com"
            displayName: "Test User"
          }) {
            id
            email
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });
});
