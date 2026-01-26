import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import Router from './components/Router/Router';
import { STORAGE_KEYS } from './utils/constants';
import { auth, isFirebaseEnabled } from './config/firebase';
import { useUserStore } from './stores/userStore';

function App() {
  const { uid, hasSeenPrivacyNotice, setUid, setAnonymousId } = useUserStore();

  // 監聽 hasSeenPrivacyNotice 的變化，一旦該值轉為 true，立即啟動匿名登入流程
  // 確保資料能即時同步，且這輩子只要簽這一次就好
  useEffect(() => {
    const performAutoSignIn = async () => {
      // 如果 Firebase 未啟用，靜默跳過
      if (!isFirebaseEnabled() || !auth) {
        return;
      }

      // 如果還沒看過隱私協議，靜默等待（不輸出任何 log）
      if (!hasSeenPrivacyNotice) {
        return;
      }

      // 檢查 Firebase auth.currentUser 是否已認證
      const isAuthenticated = auth.currentUser !== null;
      
      // 如果已經有 uid 且 Firebase 已認證，跳過登入
      if (uid && isAuthenticated) {
        return;
      }

      // 一旦 hasSeenPrivacyNotice 轉為 true，立即啟動匿名登入流程
      try {
        const userCredential = await signInAnonymously(auth);
        const userUid = userCredential.user.uid;
        setUid(userUid);
        setAnonymousId(userUid);
        console.log('App: Auto anonymous sign-in successful:', userUid);
      } catch (error) {
        console.error('App: Auto anonymous sign-in failed:', error);
        // 不阻止應用運行，只是無法使用 Firebase 功能
      }
    };

    performAutoSignIn();
  }, [hasSeenPrivacyNotice, uid, setUid, setAnonymousId]);

  // 應用啟動時，檢查是否有未完成的計時
  useEffect(() => {
    const savedTimestamp = localStorage.getItem(STORAGE_KEYS.START_TIMESTAMP);
    if (savedTimestamp) {
      const timestamp = parseInt(savedTimestamp, 10);
      const now = Date.now();
      const elapsed = now - timestamp;
      
      // 如果計時還在合理範圍內（例如 24 小時內），恢復計時
      if (elapsed < 24 * 60 * 60 * 1000) {
        // 這裡可以選擇是否自動恢復，或者提示用戶
        // 目前設定為不自動恢復，用戶需要手動開始
      }
    }
  }, []);

  return <Router />;
}

export default App;
