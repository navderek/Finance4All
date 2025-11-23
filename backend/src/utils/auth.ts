import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if running in Firestore emulator mode
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('🔧 Using Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  }

  // Initialize with service account or application default credentials
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    // Use service account from environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // Use application default credentials (for local development or Cloud Run)
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT_ID,
    });
  }

  console.log('✅ Firebase Admin SDK initialized');
  return firebaseApp;
}

// Get Firebase Admin instance
export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
}

// Verify Firebase ID token
export async function verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
  const app = getFirebaseAdmin();
  const auth = admin.auth(app);

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid Firebase token: ${error}`);
  }
}

// Get user by Firebase UID
export async function getFirebaseUser(uid: string) {
  const app = getFirebaseAdmin();
  const auth = admin.auth(app);

  try {
    const user = await auth.getUser(uid);
    return user;
  } catch (error) {
    throw new Error(`User not found: ${error}`);
  }
}

// Create custom token (useful for testing)
export async function createCustomToken(uid: string): Promise<string> {
  const app = getFirebaseAdmin();
  const auth = admin.auth(app);

  try {
    const customToken = await auth.createCustomToken(uid);
    return customToken;
  } catch (error) {
    throw new Error(`Failed to create custom token: ${error}`);
  }
}
