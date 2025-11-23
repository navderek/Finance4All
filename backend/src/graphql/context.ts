import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { verifyFirebaseToken } from '../utils/auth';

// Singleton Prisma Client
let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

export interface GraphQLContext {
  prisma: PrismaClient;
  user: DecodedIdToken | null;
  req: Request;
  res: Response;
}

export interface ContextFunctionParams {
  req: Request;
  res: Response;
}

export async function createContext({
  req,
  res,
}: ContextFunctionParams): Promise<GraphQLContext> {
  // Get Prisma client
  const prisma = getPrismaClient();

  // Extract authorization header
  const authHeader = req.headers.authorization || '';
  let user: DecodedIdToken | null = null;

  // Verify Firebase token if present
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      user = await verifyFirebaseToken(token);
    } catch (error) {
      // Invalid token, user will be null (unauthenticated)
      console.warn('Invalid Firebase token:', error);
    }
  }

  return {
    prisma,
    user,
    req,
    res,
  };
}

// Cleanup function for graceful shutdown
export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
  }
}
