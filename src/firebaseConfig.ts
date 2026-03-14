import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhC2ot8ZitWbghNVIMKIYubvbHsWNX9mM",
  authDomain: "agro-sathi-3890a.firebaseapp.com",
  projectId: "agro-sathi-3890a",
  storageBucket: "agro-sathi-3890a.firebasestorage.app",
  messagingSenderId: "690241326133",
  appId: "1:690241326133:web:46996d6b7532c70b4d757c",
  measurementId: "G-8RY27XRNEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Initialize Analytics only if available
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Analytics initialization skipped:", error);
}

export { analytics };

export default app;
