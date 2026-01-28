export type Locale = "TW" | "EN";

export interface I18nStrings {
  // 通用
  appName: string;
  leaderboard: string;
  start: string;
  pause: string;
  reset: string;
  settings: string;
  settle: string;
  finish: string;
  discard: string;
  giveUp: string;

  // 薪資輸入
  monthlySalary: string;
  dailyHours: string;
  workingDays: string;
  perSecond: string;
  perHour: string;
  modifyParams: string;

  // 顯示
  currentEarned: string;
  totalEarned: string;
  runningTime: string;

  // 文化適配備註
  note1: string;
  note2: string;

  // 幣別符號
  currency: string;

  // 撤銷實驗室
  resetLab: string;
  resetLabConfirm: string;
  resetLabConfirmMessage: string;
  resetLabCancel: string;
  resetLabConfirmButton: string;
  resetLabSuccess: string;
  resetLabConfirmMessages: string[];

  // 等價交換收據
  receiptTitle: string;
  receiptSubtitle: string;
  receiptAmount: string;
  receiptTime: string;
  receiptType: string;
  receiptTypeHealth: string;
  receiptTypeWealth: string;
  receiptConfirm: string;
  receiptConfirmButton: string;
}

export interface CurrencyParts {
  symbol: string;
  value: string;
}

export const formatCurrency = (amount: number, locale: Locale): string => {
  const symbol = locale === "TW" ? "NT$" : "$";
  const safeValue = Math.max(0, amount);

  // 1. 超過百萬：使用 M 單位
  if (safeValue >= 1000000) {
    const millions = safeValue / 1000000;
    return `${symbol}${millions.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`;
  }

  // 2. 超過一千：不顯示小數點
  if (safeValue >= 1000) {
    return `${symbol}${safeValue.toLocaleString(
      locale === "TW" ? "zh-TW" : "en-US",
      {
        maximumFractionDigits: 0,
      },
    )}`;
  }

  // 3. 一千以下：保留兩位小數
  return `${symbol}${safeValue.toLocaleString(
    locale === "TW" ? "zh-TW" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
};

export const formatCurrencyParts = (
  amount: number,
  locale: Locale,
): CurrencyParts => {
  const symbol = locale === "TW" ? "NT$" : "$";
  const safeValue = Math.max(0, amount);
  let valueStr = "";

  if (safeValue >= 1000000) {
    const millions = safeValue / 1000000;
    valueStr = `${millions.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}M`;
  } else if (safeValue >= 1000) {
    valueStr = safeValue.toLocaleString(locale === "TW" ? "zh-TW" : "en-US", {
      maximumFractionDigits: 0,
    });
  } else {
    valueStr = safeValue.toLocaleString(locale === "TW" ? "zh-TW" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return { symbol, value: valueStr };
};

/**
 * 每秒薪水格式化（精細度 4 位小數）
 */
export const formatCurrencyPerSecond = (
  amount: number,
  locale: Locale,
): string => {
  const symbol = locale === "TW" ? "NT$" : "$";
  const safeAmount = Math.max(0, amount);

  if (locale === "TW") {
    return `${symbol}${safeAmount.toLocaleString("zh-TW", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  } else {
    return `${symbol}${safeAmount.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  }
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};
