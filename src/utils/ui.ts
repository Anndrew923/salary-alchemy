import { Capacitor } from "@capacitor/core";

/**
 * UI / 平台相關工具函數
 */

/**
 * 根據金額字串長度返回對應的字體大小 Class
 * @param amountString 格式化後的金額字串
 * @returns CSS Class 名稱 ('amountLarge' | 'amountMedium' | 'amountSmall')
 */
export const getFontSizeClass = (amountString: string): string => {
  const length = amountString.length;
  if (length <= 10) {
    return "amountLarge";
  } else if (length <= 13) {
    return "amountMedium";
  } else {
    return "amountSmall";
  }
};

/**
 * 檢查目前是否在原生 (Capacitor) 平台執行
 */
export const isNative = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    // 理論上不會進來，單純防禦，確保 Web 端不會炸
    return false;
  }
};
