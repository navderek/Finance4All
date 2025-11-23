import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import { ErrorReporting } from '@google-cloud/error-reporting';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext, GraphQLContext } from './graphql/context';

// Load environment variables
dotenv.config();

// Initialize Google Cloud Error Reporting
const errors = new ErrorReporting({
  projectId: process.env.GCP_PROJECT_ID || 'finance4all-dev',
  reportMode: 'always',
});

// Create Express app and HTTP server
const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Helper function for structured logging
function writeLog(severity: 'INFO' | 'WARNING' | 'ERROR', message: string, data?: any) {
  const logEntry = JSON.stringify({
    severity,
    message,
    ...data,
    timestamp: new Date().toISOString(),
  });

  if (severity === 'ERROR') {
    console.error(logEntry);
  } else if (severity === 'WARNING') {
    console.warn(logEntry);
  } else {
    console.log(logEntry);
  }
}

// Create Apollo Server
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Use GraphQL Playground in development
    process.env.NODE_ENV === 'development'
      ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  formatError: (formattedError, error) => {
    // Log errors
    writeLog('ERROR', 'GraphQL Error', {
      message: formattedError.message,
      path: formattedError.path,
      extensions: formattedError.extensions,
    });

    // Report to Error Reporting
    if (error instanceof Error) {
      errors.report(error);
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production') {
      return {
        message: 'An error occurred processing your request',
        extensions: {
          code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
        },
      };
    }

    return formattedError;
  },
});

// Start server
async function startServer() {
  // Start Apollo Server
  await server.start();

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint (required for Cloud Run)
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      service: 'finance4all-backend',
      version: '0.3.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to Finance4All GraphQL API',
      version: '0.3.0',
      endpoints: {
        health: '/health',
        graphql: '/graphql',
      },
      documentation: 'https://github.com/navderek/Finance4All',
    });
  });

  // Apollo GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: createContext,
    })
  );

  // Test endpoint for error reporting
  app.get('/test/error', (_req: Request, _res: Response, next: NextFunction) => {
    const error = new Error('Test error for Error Reporting validation');
    (error as any).code = 'TEST_ERROR';
    console.error('Triggering test error for Error Reporting');
    next(error);
  });

  // Test endpoint for logging
  app.get('/test/log', (_req: Request, res: Response) => {
    writeLog('INFO', 'Test INFO log from /test/log endpoint', { endpoint: '/test/log' });
    writeLog('WARNING', 'Test WARNING log from /test/log endpoint', { endpoint: '/test/log' });

    res.status(200).json({
      message: 'Test logs written successfully',
      logLevels: ['INFO', 'WARNING'],
      timestamp: new Date().toISOString(),
      note: 'Check Cloud Logging console for structured logs',
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
      timestamp: new Date().toISOString(),
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    // Report error to Google Cloud Error Reporting
    errors.report(err, req);

    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString(),
    });
  });

  // Start HTTP server
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log('🚀 Finance4All Backend Starting...');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🧪 Test error: http://localhost:${PORT}/test/error`);
  console.log(`🧪 Test logs: http://localhost:${PORT}/test/log`);
  console.log('');
  console.log('Press CTRL+C to stop');

  // Log startup event
  writeLog('INFO', 'Backend service started with GraphQL', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    version: '0.3.0',
    graphqlEndpoint: '/graphql',
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await server.stop();
  httpServer.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await server.stop();
  httpServer.close();
  process.exit(0);
});
