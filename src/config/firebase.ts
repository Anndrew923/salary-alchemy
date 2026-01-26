import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase 配置（優先使用環境變數，否則使用預設配置）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCDlVSrl3WFpF4tB1I0Z5RKWrd1QE2vt18",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "salary-alchemy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "salary-alchemy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "salary-alchemy.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "428933538053",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:428933538053:web:5844081c88888d4f5dd76c"
};

// 初始化 Firebase（僅在配置完整時）
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 初始化 Firebase（配置已提供，直接初始化）
try {
  // 避免重複初始化
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase already initialized, using existing app');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  console.warn('App will continue without Firebase features');
}

export { auth, db };
export const isFirebaseEnabled = (): boolean => !!(auth && db);

export default app;
