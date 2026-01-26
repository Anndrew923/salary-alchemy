import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// 檢查 Firebase 配置是否完整
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return !!(apiKey && projectId && apiKey !== '' && projectId !== '');
};

// Firebase 配置（使用環境變數）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// 初始化 Firebase（僅在配置完整時）
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    // 避免重複初始化
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    console.warn('App will continue without Firebase features');
  }
} else {
  console.warn('Firebase not configured. Please set VITE_FIREBASE_* environment variables.');
  console.warn('App will continue without Firebase features (leaderboard, sync)');
}

export { auth, db };
export const isFirebaseEnabled = (): boolean => !!(auth && db);

export default app;
