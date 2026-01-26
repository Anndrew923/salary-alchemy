// RPG 等級系統閾值
export const RPG_LEVELS = {
  INTERN: { threshold: 0, title: '免洗實習生', titleEn: 'Intern' },
  SALARY_THIEF: { threshold: 10000, title: '薪水小偷', titleEn: 'Salary Thief' },
  SENIOR_LOAFER: { threshold: 50000, title: '資深冗員', titleEn: 'Senior Loafer' },
  ALCHEMY_MASTER: { threshold: 100000, title: '煉金大師', titleEn: 'Alchemy Master' },
} as const;

// 鑽石藍色調觸發閾值
export const DIAMOND_THRESHOLD = 500000; // 生涯總煉金超過此值，UI 變為鑽石藍

// LocalStorage Keys
export const STORAGE_KEYS = {
  START_TIMESTAMP: 'alchemy_start_timestamp',
  TOTAL_EARNED: 'alchemy_total_earned',
  MONTHLY_SALARY: 'user_monthly_salary',
  DAILY_HOURS: 'user_daily_hours',
  WORKING_DAYS: 'user_working_days',
  LOCALE: 'user_locale',
} as const;
