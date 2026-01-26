// 等級標題定義
export const LEVEL_TITLES = {
  TW: [
    '免洗實習生',
    '廁所見習生',
    '試用期小偷',
    '薪水小偷',
    '帶薪拉屎官',
    '馬桶管理員',
    '摸魚專員',
    '資深冗員',
    '公司的盲腸',
    '薪水強盜',
    '煉金大師',
    '首席廁所官 (CTO)',
  ],
  EN: [
    'Intern',
    'Toilet Trainee',
    'Probationary Thief',
    'Salary Thief',
    'Paid Pooper',
    'Toilet Manager',
    'Slack Specialist',
    'Senior Loafer',
    'The Appendix',
    'Salary Bandit',
    'Alchemy Master',
    'Chief Toilet Officer',
  ],
};

// RPG 等級系統閾值 (12 階) - 台幣版本
export const RPG_LEVELS_TW = [
  { threshold: 0, tier: 1 },
  { threshold: 300, tier: 1 },
  { threshold: 600, tier: 1 },
  { threshold: 1200, tier: 2 },
  { threshold: 2000, tier: 2 },
  { threshold: 3000, tier: 2 },
  { threshold: 4500, tier: 3 },
  { threshold: 6000, tier: 3 },
  { threshold: 8000, tier: 3 },
  { threshold: 12000, tier: 4 },
  { threshold: 20000, tier: 4 },
  { threshold: 30000, tier: 5 },
] as const;

// 邏輯：EN 門檻 = TW 門檻 / 15 (將美金難度提高兩倍，以符合高薪物價)
export const RPG_LEVELS_EN = RPG_LEVELS_TW.map(lv => ({
  ...lv,
  threshold: Math.round(lv.threshold / 15),
}));

// 鑽石藍色調觸發閾值 (台幣)
export const DIAMOND_THRESHOLD_TW = 30000;
// 鑽石藍色調觸發閾值 (美金)
export const DIAMOND_THRESHOLD_EN = Math.round(DIAMOND_THRESHOLD_TW / 15);

// 向後兼容：保留舊的常數名稱（使用 TW 版本）
export const DIAMOND_THRESHOLD = DIAMOND_THRESHOLD_TW;

// 匯率常數：台幣對美金的匯率
export const EXCHANGE_RATE = 30;

// LocalStorage Keys
export const STORAGE_KEYS = {
  START_TIMESTAMP: 'alchemy_start_timestamp',
  TOTAL_EARNED: 'alchemy_total_earned',
  MONTHLY_SALARY: 'user_monthly_salary',
  DAILY_HOURS: 'user_daily_hours',
  WORKING_DAYS: 'user_working_days',
  LOCALE: 'user_locale',
} as const;
