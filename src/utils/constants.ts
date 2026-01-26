// RPG 等級系統閾值 (12 階)
export const RPG_LEVELS = [
  { threshold: 0, tier: 1, title: '免洗實習生', titleEn: 'Intern' },
  { threshold: 300, tier: 1, title: '廁所見習生', titleEn: 'Toilet Trainee' },
  { threshold: 600, tier: 1, title: '試用期小偷', titleEn: 'Probationary Thief' },
  { threshold: 1200, tier: 2, title: '薪水小偷', titleEn: 'Salary Thief' },
  { threshold: 2000, tier: 2, title: '帶薪拉屎官', titleEn: 'Paid Pooper' },
  { threshold: 3000, tier: 2, title: '馬桶管理員', titleEn: 'Toilet Manager' },
  { threshold: 4500, tier: 3, title: '摸魚專員', titleEn: 'Slack Specialist' },
  { threshold: 6000, tier: 3, title: '資深冗員', titleEn: 'Senior Loafer' },
  { threshold: 8000, tier: 3, title: '公司的盲腸', titleEn: 'The Appendix' },
  { threshold: 12000, tier: 4, title: '薪水強盜', titleEn: 'Salary Bandit' },
  { threshold: 20000, tier: 4, title: '煉金大師', titleEn: 'Alchemy Master' },
  { threshold: 30000, tier: 5, title: '首席廁所官 (CTO)', titleEn: 'Chief Toilet Officer' },
] as const;

// 鑽石藍色調觸發閾值
export const DIAMOND_THRESHOLD = 30000;

// LocalStorage Keys
export const STORAGE_KEYS = {
  START_TIMESTAMP: 'alchemy_start_timestamp',
  TOTAL_EARNED: 'alchemy_total_earned',
  MONTHLY_SALARY: 'user_monthly_salary',
  DAILY_HOURS: 'user_daily_hours',
  WORKING_DAYS: 'user_working_days',
  LOCALE: 'user_locale',
} as const;
