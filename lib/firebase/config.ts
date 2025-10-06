import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Define an interface for your config if you want stronger TypeScript validation
// interface FirebaseConfig {
//   apiKey: string;
//   authDomain: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId: string;
//   appId: string;
// }

const firebaseConfig = {
  // Next.js automatically injects these from .env.local
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 1. Initialize Firebase App (Ensures only one instance is created)
let app: FirebaseApp;
if (getApps().length === 0) {
  // If no app is initialized, create one
  app = initializeApp(firebaseConfig);
} else {
  // If an app is already initialized (due to HMR/SSR), retrieve the default app
  // Using getApp() is slightly cleaner than getApps()[0]
  app = getApp();
}

// 2. Initialize Services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// 3. Export the app instance (optional, but useful for other services)
export { app };
