import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getFirebaseAuth } from './firebase';

/**
 * Apollo Client Configuration
 *
 * Configures the GraphQL client with:
 * - HTTP link to backend GraphQL endpoint
 * - Authentication middleware (Firebase JWT)
 * - Error handling
 * - In-memory cache
 */

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Include cookies for session management
});

// Authentication middleware - adds Firebase JWT to requests
const authLink = new ApolloLink((operation, forward) => {
  // Get current user's ID token
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  // If user is logged in, get their token and add to headers
  if (user) {
    return new Promise((resolve, reject) => {
      user
        .getIdToken()
        .then((token) => {
          // Add token to headers
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            },
          }));
          resolve(forward(operation));
        })
        .catch((error) => {
          console.error('Error getting Firebase token:', error);
          reject(error);
        });
    }) as any;
  }

  // No user, proceed without auth header
  return forward(operation);
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Could trigger logout or redirect to login
        console.error('Authentication error - user may need to log in again');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache configuration for specific queries
          // Can add field-specific policies here as needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', // Always fetch fresh data but show cached data first
      errorPolicy: 'all', // Return partial data even if there are errors
    },
    query: {
      fetchPolicy: 'network-only', // Always fetch from network for queries
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
