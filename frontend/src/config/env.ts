/**
 * Environment Configuration
 * Centralizes access to environment variables with type safety
 */

export const env = {
  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',

  // Backend API
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',

  // Firestore Emulator
  firestoreEmulatorHost: import.meta.env.VITE_FIRESTORE_EMULATOR_HOST,
  useFirestoreEmulator: import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true',

  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableSentry: import.meta.env.VITE_ENABLE_SENTRY === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },
} as const;

// Validate required environment variables
if (!env.backendUrl) {
  console.warn('VITE_BACKEND_URL is not set. Using default: http://localhost:4000');
}

export default env;
