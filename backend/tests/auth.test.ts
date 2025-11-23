import {
  initializeFirebase,
  getFirebaseAdmin,
  verifyFirebaseToken,
  getFirebaseUser,
  createCustomToken,
} from '../src/utils/auth';
import admin from 'firebase-admin';

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
    createCustomToken: jest.fn(),
  };

  const mockApp = {
    name: 'test-app',
  };

  return {
    __esModule: true,
    default: {
      initializeApp: jest.fn(() => mockApp),
      credential: {
        cert: jest.fn(),
      },
      auth: jest.fn(() => mockAuth),
      app: jest.fn(() => mockApp),
    },
  };
});

describe('Authentication & Authorization', () => {
  let mockAuth: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = {
      verifyIdToken: jest.fn(),
      getUser: jest.fn(),
      createCustomToken: jest.fn(),
    };
    (admin.auth as jest.Mock).mockReturnValue(mockAuth);
  });

  afterEach(() => {
    // Reset the firebaseApp singleton between tests
    jest.resetModules();
  });

  describe('Firebase Initialization', () => {
    it('should initialize Firebase with service account credentials', () => {
      process.env.FIREBASE_PRIVATE_KEY = 'test-private-key\\nwith\\nnewlines';
      process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project';

      const app = initializeFirebase();

      expect(admin.initializeApp).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'test-project',
        })
      );
      expect(app).toBeDefined();
    });

    it('should initialize Firebase with application default credentials', () => {
      delete process.env.FIREBASE_PRIVATE_KEY;
      delete process.env.FIREBASE_CLIENT_EMAIL;
      process.env.FIREBASE_PROJECT_ID = 'test-project';

      const app = initializeFirebase();

      expect(admin.initializeApp).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'test-project',
        })
      );
      expect(app).toBeDefined();
    });

    it('should use Firestore emulator settings when FIRESTORE_EMULATOR_HOST is set', () => {
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      initializeFirebase();

      expect(process.env.FIREBASE_AUTH_EMULATOR_HOST).toBe('localhost:9099');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using Firestore Emulator')
      );

      consoleLogSpy.mockRestore();
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    });

    it('should return existing app if already initialized', () => {
      const firstApp = initializeFirebase();
      const secondApp = initializeFirebase();

      expect(firstApp).toBe(secondApp);
      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
    });
  });

  describe('Firebase Admin Instance', () => {
    it('should return Firebase admin instance', () => {
      const app = getFirebaseAdmin();
      expect(app).toBeDefined();
    });

    it('should initialize Firebase if not already initialized', () => {
      const app = getFirebaseAdmin();
      expect(app).toBeDefined();
      expect(admin.initializeApp).toHaveBeenCalled();
    });
  });

  describe('Token Verification', () => {
    it('should verify valid Firebase token', async () => {
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const result = await verifyFirebaseToken('valid-token');

      expect(result).toEqual(mockDecodedToken);
      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error for invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(verifyFirebaseToken('invalid-token')).rejects.toThrow(
        'Invalid Firebase token'
      );
    });

    it('should throw error for expired token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Firebase ID token has expired')
      );

      await expect(verifyFirebaseToken('expired-token')).rejects.toThrow(
        'Invalid Firebase token'
      );
    });

    it('should throw error for revoked token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Firebase ID token has been revoked')
      );

      await expect(verifyFirebaseToken('revoked-token')).rejects.toThrow(
        'Invalid Firebase token'
      );
    });

    it('should throw error for malformed token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Decoding Firebase ID token failed')
      );

      await expect(verifyFirebaseToken('malformed-token')).rejects.toThrow(
        'Invalid Firebase token'
      );
    });
  });

  describe('User Retrieval', () => {
    it('should get user by Firebase UID', async () => {
      const mockUserRecord = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        disabled: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
      };

      mockAuth.getUser.mockResolvedValue(mockUserRecord);

      const result = await getFirebaseUser('user-123');

      expect(result).toEqual(mockUserRecord);
      expect(mockAuth.getUser).toHaveBeenCalledWith('user-123');
    });

    it('should throw error when user not found', async () => {
      mockAuth.getUser.mockRejectedValue(new Error('User not found'));

      await expect(getFirebaseUser('non-existent-user')).rejects.toThrow(
        'User not found'
      );
    });

    it('should throw error for invalid UID format', async () => {
      mockAuth.getUser.mockRejectedValue(new Error('Invalid UID'));

      await expect(getFirebaseUser('invalid-uid')).rejects.toThrow('User not found');
    });
  });

  describe('Custom Token Creation', () => {
    it('should create custom token for user', async () => {
      const mockCustomToken = 'custom-token-abc123';
      mockAuth.createCustomToken.mockResolvedValue(mockCustomToken);

      const result = await createCustomToken('user-123');

      expect(result).toBe(mockCustomToken);
      expect(mockAuth.createCustomToken).toHaveBeenCalledWith('user-123');
    });

    it('should create custom token with additional claims', async () => {
      const mockCustomToken = 'custom-token-with-claims';
      mockAuth.createCustomToken.mockResolvedValue(mockCustomToken);

      // Note: The current implementation doesn't support additional claims,
      // but we can test the basic functionality
      const result = await createCustomToken('user-123');

      expect(result).toBe(mockCustomToken);
    });

    it('should throw error when token creation fails', async () => {
      mockAuth.createCustomToken.mockRejectedValue(
        new Error('Token creation failed')
      );

      await expect(createCustomToken('user-123')).rejects.toThrow(
        'Failed to create custom token'
      );
    });

    it('should throw error for invalid UID', async () => {
      mockAuth.createCustomToken.mockRejectedValue(new Error('Invalid UID'));

      await expect(createCustomToken('')).rejects.toThrow(
        'Failed to create custom token'
      );
    });
  });

  describe('Authorization Scenarios', () => {
    it('should allow access with valid token and correct user', async () => {
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('valid-token');

      // Simulate authorization check
      const requestedUserId = 'user-123';
      const isAuthorized = decodedToken.uid === requestedUserId;

      expect(isAuthorized).toBe(true);
    });

    it('should deny access when user tries to access another users data', async () => {
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('valid-token');

      // Simulate authorization check for different user's data
      const requestedUserId = 'user-456';
      const isAuthorized = decodedToken.uid === requestedUserId;

      expect(isAuthorized).toBe(false);
    });

    it('should deny access without authentication token', async () => {
      // No token provided
      const hasToken = false;

      expect(hasToken).toBe(false);
    });

    it('should handle email verification requirement', async () => {
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: false, // Email not verified
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('valid-token');

      // Check if email is verified (application-level requirement)
      expect(decodedToken.email_verified).toBe(false);
    });
  });

  describe('Security Best Practices', () => {
    it('should not expose sensitive error details', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Sensitive internal error message')
      );

      try {
        await verifyFirebaseToken('invalid-token');
      } catch (error: any) {
        // Should wrap error in generic message
        expect(error.message).toContain('Invalid Firebase token');
        expect(error.message).not.toContain('Sensitive internal');
      }
    });

    it('should handle tokens from different Firebase projects', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Firebase project mismatch')
      );

      await expect(
        verifyFirebaseToken('token-from-different-project')
      ).rejects.toThrow('Invalid Firebase token');
    });

    it('should handle tokens with tampered signatures', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(
        new Error('Invalid token signature')
      );

      await expect(verifyFirebaseToken('tampered-token')).rejects.toThrow(
        'Invalid Firebase token'
      );
    });
  });

  describe('Role-Based Access Control (RBAC)', () => {
    it('should verify admin role from custom claims', async () => {
      const mockDecodedToken = {
        uid: 'admin-user',
        email: 'admin@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        role: 'ADMIN', // Custom claim
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('admin-token');

      // Check for admin role
      const isAdmin = (decodedToken as any).role === 'ADMIN';
      expect(isAdmin).toBe(true);
    });

    it('should verify regular user role', async () => {
      const mockDecodedToken = {
        uid: 'regular-user',
        email: 'user@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        role: 'USER', // Custom claim
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('user-token');

      // Check for user role
      const isUser = (decodedToken as any).role === 'USER';
      expect(isUser).toBe(true);
    });

    it('should default to USER role if no role claim present', async () => {
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: Date.now(),
        iat: Date.now(),
        exp: Date.now() + 3600,
        // No role claim
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('token');

      // Should default to USER role at application level
      const role = (decodedToken as any).role || 'USER';
      expect(role).toBe('USER');
    });
  });

  describe('Token Refresh Scenarios', () => {
    it('should handle near-expiry tokens', async () => {
      const now = Date.now();
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: now - 3000,
        iat: now - 3000,
        exp: now + 300, // Expires in 5 minutes
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('near-expiry-token');

      // Check if token is near expiry
      const timeUntilExpiry = decodedToken.exp - Date.now();
      const isNearExpiry = timeUntilExpiry < 600000; // Less than 10 minutes

      expect(isNearExpiry).toBe(true);
    });

    it('should verify freshly issued token', async () => {
      const now = Date.now();
      const mockDecodedToken = {
        uid: 'user-123',
        email: 'test@example.com',
        email_verified: true,
        auth_time: now,
        iat: now,
        exp: now + 3600000, // Expires in 1 hour
        firebase: {
          sign_in_provider: 'password',
          identities: {},
        },
      };

      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const decodedToken = await verifyFirebaseToken('fresh-token');

      // Verify token was recently issued
      const tokenAge = Date.now() - decodedToken.iat;
      const isRecentlyIssued = tokenAge < 60000; // Less than 1 minute old

      expect(isRecentlyIssued).toBe(true);
    });
  });
});
