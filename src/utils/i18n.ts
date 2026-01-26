export type Locale = 'TW' | 'EN';

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
    appName: '帶薪煉金術',
    leaderboard: '排行榜',
    start: '開始煉金',
    pause: '暫停',
    reset: '重置',
    settings: '設定',
    settle: '煉成',
    finish: '結束',
    discard: '放棄',
    monthlySalary: '月薪',
    dailyHours: '每日工時',
    workingDays: '工作天數',
    perSecond: '每秒',
    perHour: '每小時',
    modifyParams: '修改參數',
    currentEarned: '當前煉金',
    totalEarned: '累計煉金',
    runningTime: '運行時間',
    note1: '茶葉蛋',
    note2: '雞腿便當',
    currency: 'TWD',
    resetLab: '撤銷實驗室 (重置總額)',
    resetLabConfirm: '確認撤銷實驗室',
    resetLabConfirmMessage: '此操作將永久清除所有累計煉金記錄，且無法復原。確定要繼續嗎？',
    resetLabCancel: '取消',
    resetLabConfirmButton: '確認撤銷',
    receiptTitle: '等價交換收據',
    receiptSubtitle: 'EQUIVALENT EXCHANGE RECEIPT',
    receiptAmount: '煉金金額',
    receiptTime: '煉金時間',
    receiptType: '交換類型',
    receiptTypeHealth: '健康風險',
    receiptTypeWealth: '財富累積',
    receiptConfirm: '確認',
    receiptConfirmButton: '收入口袋',
  },
  EN: {
    appName: 'Salary Alchemy',
    leaderboard: 'Leaderboard',
    start: 'Start Alchemy',
    pause: 'Pause',
    reset: 'Reset',
    settings: 'Settings',
    settle: 'Settle',
    finish: 'Finish',
    discard: 'Discard',
    monthlySalary: 'Monthly Salary',
    dailyHours: 'Daily Hours',
    workingDays: 'Working Days',
    perSecond: 'Per Second',
    perHour: 'Per Hour',
    modifyParams: 'Modify Params',
    currentEarned: 'Current Earned',
    totalEarned: 'Total Earned',
    runningTime: 'Running Time',
    note1: 'Donut',
    note2: 'Netflix Subscription',
    currency: 'USD',
    resetLab: 'Reset Lab (Clear Total)',
    resetLabConfirm: 'Confirm Lab Reset',
    resetLabConfirmMessage: 'This action will permanently clear all accumulated earnings and cannot be undone. Are you sure?',
    resetLabCancel: 'Cancel',
    resetLabConfirmButton: 'Confirm Reset',
    receiptTitle: 'Equivalent Exchange Receipt',
    receiptSubtitle: 'EQUIVALENT EXCHANGE RECEIPT',
    receiptAmount: 'Alchemy Amount',
    receiptTime: 'Alchemy Time',
    receiptType: 'Exchange Type',
    receiptTypeHealth: 'Health Risk',
    receiptTypeWealth: 'Wealth Accumulation',
    receiptConfirm: 'Confirm',
    receiptConfirmButton: 'Confirm',
  },
};

export const getI18n = (locale: Locale): I18nStrings => {
  return translations[locale];
};

export const formatCurrency = (amount: number, locale: Locale): string => {
  const symbol = locale === 'TW' ? 'NT$' : '$';
  
  if (locale === 'TW') {
    return `${symbol}${amount.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
