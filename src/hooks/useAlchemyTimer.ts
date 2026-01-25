import { useEffect, useState } from 'react';
import { useAlchemyStore } from '../stores/alchemyStore';
import { Capacitor } from '@capacitor/core';

export const useAlchemyTimer = () => {
  const { startTimestamp, isRunning } = useAlchemyStore();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTimestamp || !isRunning) {
      setElapsedSeconds(0);
      return;
    }

    // 初始計算
    const updateElapsed = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);
      setElapsedSeconds(elapsed);
    };

    updateElapsed();

    // 每秒更新一次（僅用於 UI 顯示，不影響核心計算）
    const interval = setInterval(updateElapsed, 1000);

    // 監聽 Capacitor App 狀態變化（僅在 Native 環境）
    let appStateListener: any = null;
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/app').then(({ App }) => {
        const handleAppStateChange = async () => {
          const state = await App.getState();
          if (state.isActive && startTimestamp) {
            // App 回到前台時，重新計算時間差
            updateElapsed();
          }
        };

        App.addListener('appStateChange', handleAppStateChange).then((listener) => {
          appStateListener = listener;
        });
      });
    }

    // 監聽 Web 環境的 visibilitychange 事件
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && startTimestamp) {
        updateElapsed();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (appStateListener) {
        appStateListener.remove();
      }
    };
  }, [startTimestamp, isRunning]);

  return elapsedSeconds;
};
