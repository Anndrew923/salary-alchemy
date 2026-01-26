export type Locale = 'TW' | 'EN';

export interface I18nStrings {
  // 通用
  appName: string;
  start: string;
  pause: string;
  reset: string;
  settings: string;
  
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
}

const translations: Record<Locale, I18nStrings> = {
  TW: {
    appName: '帶薪煉金術',
    start: '開始煉金',
    pause: '暫停',
    reset: '重置',
    settings: '設定',
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
  },
  EN: {
    appName: 'Salary Alchemy',
    start: 'Start Alchemy',
    pause: 'Pause',
    reset: 'Reset',
    settings: 'Settings',
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
