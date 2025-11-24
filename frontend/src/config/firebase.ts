import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { env } from './env';

/**
 * Firebase Configuration
 * Initializes Firebase app, authentication, and Firestore
 */

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseFirestore: Firestore | null = null;

export const initializeFirebase = (): FirebaseApp => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
  };

  // Validate required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is incomplete. Check environment variables.');
  }

  firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
};

export const getFirebaseAuth = (): Auth => {
  if (!firebaseAuth) {
    const app = initializeFirebase();
    firebaseAuth = getAuth(app);

    // Connect to emulator in development
    if (env.nodeEnv === 'development' && env.firebase.useEmulator) {
      try {
        connectAuthEmulator(firebaseAuth, 'http://localhost:9099', {
          disableWarnings: true,
        });
        console.log('🔧 Connected to Firebase Auth Emulator');
      } catch (error) {
        console.warn('Failed to connect to Auth Emulator:', error);
      }
    }
  }

  return firebaseAuth;
};

export const getFirebaseFirestore = (): Firestore => {
  if (!firebaseFirestore) {
    const app = initializeFirebase();
    firebaseFirestore = getFirestore(app);

    // Connect to emulator in development
    if (env.nodeEnv === 'development' && env.firebase.useEmulator) {
      try {
        connectFirestoreEmulator(firebaseFirestore, 'localhost', 8080);
        console.log('🔧 Connected to Firestore Emulator');
      } catch (error) {
        console.warn('Failed to connect to Firestore Emulator:', error);
      }
    }
  }

  return firebaseFirestore;
};

// Export initialized instances
export const firebase = {
  app: () => initializeFirebase(),
  auth: () => getFirebaseAuth(),
  firestore: () => getFirebaseFirestore(),
};
