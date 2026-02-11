import { useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';

const BACK_DOUBLE_TAP_INTERVAL_MS = 2000;

/**
 * 取得當前標準化路徑（與 Router 的 hash 一致）。
 * 專案使用 Hash-based Routing (#/path)，此處不依賴 react-router，便於長遠架構下任意新增頁面皆能繼承返回邏輯。
 */
function getCurrentPath(): string {
  let hash = window.location.hash.slice(1) || '/';
  if (hash && !hash.startsWith('/')) {
    hash = '/' + hash;
  }
  return hash;
}

/**
 * 全域 Android 返回鍵處理 Hook。
 * 僅在 Capacitor 原生平台註冊 backButton 監聽，負責：
 * - 路由分流：依當前路徑決定返回上一層或首頁；
 * - 首頁雙擊退出：第一次顯示 Toast 提示，2 秒內再按一次則退出 App。
 *
 * 設計原則（長遠架構）：
 * - 邏輯集中於此，不在各頁面重複寫返回處理；
 * - 未來新增「設定頁」「成就頁」等，只需在此擴充路徑判斷即可自動繼承。
 *
 * @param showToast - 顯示 Toast 的 callback，由 App 注入（可依專案煉金風格渲染）
 */
export function useBackButton(showToast: (message: string) => void) {
  const { t } = useTranslation();
  const lastBackPressRef = useRef<number>(0);

  const handleBack = useCallback(async () => {
    const path = getCurrentPath();

    // --- 分流邏輯：非首頁 → 返回上一層或首頁 ---
    if (path === '/collection') {
      window.location.hash = '#/';
      return;
    }
    if (path === '/privacy') {
      window.location.hash = '#/settings';
      return;
    }
    if (path === '/settings' || path === '/leaderboard') {
      window.location.hash = '#/';
      return;
    }

    // --- 首頁：雙擊退出 ---
    if (path === '/') {
      const now = Date.now();
      const elapsed = now - lastBackPressRef.current;

      if (elapsed > BACK_DOUBLE_TAP_INTERVAL_MS) {
        showToast(t('exit_warning'));
        lastBackPressRef.current = now;
        return;
      }

      // 2 秒內再次點擊 → 退出 App
      const { App: CapacitorApp } = await import('@capacitor/app');
      /*
       * Android 歷史堆棧 (History Stack) 說明：
       * - CapacitorApp.exitApp() 在 Android 上會依廠商/版本有不同的底層實作（如 finish() 或 moveTaskToBack(true)）。
       * - 若遇到「按一次就關閉」或「無法關閉」等行為，可考慮：
       *   1) 在 capacitor.config 或 Android 專案中確認 Back 是否被 WebView 消費；
       *   2) 使用 @capacitor/app 的 exitApp() 即可覆蓋多數機型，無需手動處理堆棧；
       *   3) 進階需求可透過 Capacitor 插件或自寫 Native 代碼取得 Back 的預設行為再決定是否 finish。
       */
      CapacitorApp.exitApp();
      return;
    }

    // 未列舉路徑（如未來成就頁、其他子頁）一律返回首頁，確保返回鍵行為可預期
    window.location.hash = '#/';
  }, [t, showToast]);

  const register = useCallback(() => {
    if (!Capacitor.isNativePlatform()) {
      return () => {};
    }

    // 立即建立 Promise，避免 unmount 時 cleanup 早於 setup 完成導致 listener 無法移除
    const listenerPromise = (async () => {
      const { App: CapacitorApp } = await import('@capacitor/app');
      return CapacitorApp.addListener('backButton', () => {
        handleBack();
      });
    })();

    return () => {
      listenerPromise.then((l) => l.remove());
    };
  }, [handleBack]);

  return { register };
}
