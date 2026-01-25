import { useEffect } from 'react';
import Router from './components/Router/Router';
import { STORAGE_KEYS } from './utils/constants';

function App() {

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
