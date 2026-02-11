import { useEffect, useState, useCallback } from 'react';
import { signInAnonymously } from 'firebase/auth';
import Router from './components/Router/Router';
import PrivacyNoticeModal from './components/PrivacyNoticeModal/PrivacyNoticeModal';
import LandingPage from './components/LandingPage/LandingPage';
import Toast from './components/Toast/Toast';
import { STORAGE_KEYS } from './utils/constants';
import { auth, isFirebaseEnabled } from './config/firebase';
import { useUserStore } from './stores/userStore';
import { useBackButton } from './hooks/useBackButton';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const { uid, hasSeenPrivacyNotice, isPrivacyModalOpen, setUid, setAnonymousId } = useUserStore();

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage('');
  }, []);

  const { register: registerBackButton } = useBackButton(showToast);

  useEffect(() => {
    const remove = registerBackButton();
    return remove;
  }, [registerBackButton]);

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

  // Toast 與返回鍵邏輯全域生效，故與 Loading / 主應用同層渲染，避免在 Landing 時按返回有提示但無 UI
  return (
    <>
      {isLoading ? (
        <LandingPage onFinish={() => setIsLoading(false)} />
      ) : (
        <>
          <Router />
          {isPrivacyModalOpen && (
            <PrivacyNoticeModal
              onAgree={() => {
                // Modal 關閉邏輯在 PrivacyNoticeModal 內部處理
              }}
            />
          )}
        </>
      )}
      <Toast
        message={toastMessage}
        visible={!!toastMessage}
        onDismiss={dismissToast}
      />
    </>
  );
}

export default App;
