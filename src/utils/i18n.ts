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

const translations: Record<Locale, I18nStrings> = {
  TW: {
    appName: "帶薪煉金術",
    leaderboard: "排行榜",
    start: "開始煉金",
    pause: "暫停",
    reset: "重置",
    settings: "設定",
    settle: "煉成",
    finish: "煉成",
    discard: "放棄",
    giveUp: "放棄",
    monthlySalary: "月薪",
    dailyHours: "每日工時",
    workingDays: "工作天數",
    perSecond: "每秒",
    perHour: "每小時",
    modifyParams: "修改參數",
    currentEarned: "當前煉金",
    totalEarned: "累計煉金",
    runningTime: "運行時間",
    note1: "茶葉蛋",
    note2: "雞腿便當",
    currency: "TWD",
    resetLab: "撤銷實驗室 (重置總額)",
    resetLabConfirm: "確認撤銷實驗室",
    resetLabConfirmMessage:
      "此操作將永久清除所有累計煉金記錄，且無法復原。確定要繼續嗎？",
    resetLabCancel: "取消",
    resetLabConfirmButton: "確認撤銷",
    resetLabSuccess: "重置成功！實驗室已清空，排行榜數據已同步清除。",
    resetLabConfirmMessages: [
      "你的實驗室要爆炸了！確定要讓一切歸零，回到那個平凡的打工仔生活嗎？",
      "這是一鍵轉生術！按下去後你的財富將化為烏有，但也換來了重新做人的機會...吧？",
      "Boss，這不是演習！你的煉金設備即將被回收，排行榜上的名字也會消失喔！",
      "難道你已經煉金煉到走火入魔？按下去，這一切都會像午休時間一樣消失。",
      "你確定要洗白嗎？隔壁的煉金術師已經快超越你了，現在重來真的好嗎？",
      "確定執行「賢者模式」？所有財富將會歸零，你的煉金之路將從頭開始。",
      "系統偵測到你想不開！這顆按鈕按下去，你的千萬身價就會變成一場空。",
      "這不是按錯吧？一旦重置，連上帝都救不了你的排行榜排名喔！",
      "想要退隱江湖？按下去，你就是個沒有過去的煉金新手了。",
      "注意！實驗室正在進行自毀程序。確定要刪除所有數據，重新開始你的帶薪生活？",
    ],
    receiptTitle: "等價交換收據",
    receiptSubtitle: "EQUIVALENT EXCHANGE RECEIPT",
    receiptAmount: "煉金金額",
    receiptTime: "煉金時間",
    receiptType: "交換類型",
    receiptTypeHealth: "健康風險",
    receiptTypeWealth: "財富累積",
    receiptConfirm: "確認",
    receiptConfirmButton: "收入口袋",
  },
  EN: {
    appName: "Salary Alchemy",
    leaderboard: "Leaderboard",
    start: "Start Alchemy",
    pause: "Pause",
    reset: "Reset",
    settings: "Settings",
    settle: "Settle",
    finish: "Finish",
    discard: "Discard",
    giveUp: "Give Up",
    monthlySalary: "Monthly Salary",
    dailyHours: "Daily Hours",
    workingDays: "Working Days",
    perSecond: "Per Second",
    perHour: "Per Hour",
    modifyParams: "Modify Params",
    currentEarned: "Current Earned",
    totalEarned: "Total Earned",
    runningTime: "Running Time",
    note1: "Donut",
    note2: "Netflix Subscription",
    currency: "USD",
    resetLab: "Reset Lab (Clear Total)",
    resetLabConfirm: "Confirm Lab Reset",
    resetLabConfirmMessage:
      "This action will permanently clear all accumulated earnings and cannot be undone. Are you sure?",
    resetLabCancel: "Cancel",
    resetLabConfirmButton: "Confirm Reset",
    resetLabSuccess:
      "Reset successful! Laboratory cleared, leaderboard data synced.",
    resetLabConfirmMessages: [
      "Your lab is about to explode! Are you sure you want to reset everything and return to that ordinary working life?",
      "This is a one-click reincarnation! Press it and your wealth will vanish, but you'll get a chance to start over... right?",
      "Boss, this is not a drill! Your alchemy equipment is about to be reclaimed, and your name on the leaderboard will disappear!",
      "Have you gone mad from alchemy? Press it, and everything will vanish like your lunch break.",
      "Are you sure you want to start fresh? The alchemist next door is about to surpass you. Is it really a good time to restart?",
      'Execute "Sage Mode"? All wealth will be reset to zero, and your alchemy journey will start from scratch.',
      "System detected you're having second thoughts! Press this button and your millions will become nothing.",
      "This isn't a mistake, right? Once reset, even God can't save your leaderboard ranking!",
      "Want to retire from the world? Press it, and you'll become a rookie alchemist with no past.",
      "Warning! Laboratory self-destruct sequence initiated. Are you sure you want to delete all data and restart your paid life?",
    ],
    receiptTitle: "Equivalent Exchange Receipt",
    receiptSubtitle: "EQUIVALENT EXCHANGE RECEIPT",
    receiptAmount: "Alchemy Amount",
    receiptTime: "Alchemy Time",
    receiptType: "Exchange Type",
    receiptTypeHealth: "Health Risk",
    receiptTypeWealth: "Wealth Accumulation",
    receiptConfirm: "Confirm",
    receiptConfirmButton: "Confirm",
  },
};

export const getI18n = (locale: Locale): I18nStrings => {
  return translations[locale];
};

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
