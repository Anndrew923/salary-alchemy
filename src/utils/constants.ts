// 等級標題定義 (50 級)
export const LEVEL_TITLES = {
  TW: [
    "免洗實習生",
    "廁所見習生",
    "試用期小偷",
    "薪水小偷",
    "帶薪拉屎官",
    "馬桶管理員",
    "摸魚專員",
    "資深冗員",
    "公司的盲腸",
    "薪水強盜",
    "煉金大師",
    "首席廁所官 (CTO)",
    "影印機隱居者",
    "週報虛構大師",
    "會議逃脫專家",
    "PPT 幻術師",
    "咖啡機寄生蟲",
    "馬桶隔間領主",
    "帶薪睡眠家",
    "資本主義的漏洞",
    "辦公室獵人",
    "馬桶上的華爾街",
    "資遣費精算師",
    "勞基法守護神",
    "飲水機控股人",
    "空調系統掠奪者",
    "專案終結者",
    "稅務避難所",
    "勞資談判魔王",
    "馬桶墊加溫領袖",
    "數據粉碎者",
    "股東會的噩夢",
    "財報粉飾大師",
    "辦公室不動產商",
    "連鎖廁所教父",
    "跨國勞務駭客",
    "金融海嘯製造機",
    "公司的靈魂腫瘤",
    "敵意併購魔王",
    "市場規則破壞者",
    "馬桶上的哲學家",
    "勞動力黑洞",
    "數位游牧神話",
    "公司淨值的殺手",
    "董事長的噩夢",
    "X 平台收購者",
    "SpaceX 贊助商",
    "跨星球執行長",
    "火星殖民開拓者",
    "馬斯克級：銀河執行長",
  ],
  EN: [
    "Disposable Intern",
    "Restroom Trainee",
    "Probationary Thief",
    "Salary Thief",
    "Chief Poop Officer",
    "Toilet Manager",
    "Slack Specialist",
    "Senior Loafer",
    "The Corporate Appendix",
    "Salary Bandit",
    "Alchemy Master",
    "The King of Stalls",
    "Copier Hermit",
    "Weekly Report Fictionist",
    "Meeting Escape Artist",
    "PPT Illusionist",
    "Coffee Machine Parasite",
    "Stall Partition Lord",
    "Paid Sleeper",
    "Capitalism Loophole",
    "Office Hunter",
    "Wall Street on a Toilet",
    "Severance Actuary",
    "Guardian of Labor Laws",
    "Water Cooler Shareholder",
    "Air Conditioning Predator",
    "Project Terminator",
    "Tax Haven Cubicle",
    "Labor Negotiation Demon",
    "Heated Seat Leader",
    "Data Shredder",
    "Shareholder's Nightmare",
    "Financial Window Dresser",
    "Office Real Estate Mogul",
    "The Godfather of Toilets",
    "Global Labor Hacker",
    "Economic Tsunami Generator",
    "The Soul Tumor",
    "Hostile Takeover Overlord",
    "Market Rule Breaker",
    "The Toilet Philosopher",
    "Labor Black Hole",
    "Digital Nomad Myth",
    "Net Worth Assassin",
    "Chairman's Nightmare",
    "X (Twitter) Acquirer",
    "SpaceX Sponsor",
    "Interplanetary CEO",
    "Martian Colony Pioneer",
    "Elon Musk Grade: Galactic CEO",
  ],
};

/**
 * 程式化生成 50 個等級的門檻值
 * 等級曲線設計：
 * - Lv.1-10: 0 到 1 萬 TWD（線性成長）
 * - Lv.11-30: 1 萬到 1 億 TWD（指數成長）
 * - Lv.31-45: 1 億到 1000 億 TWD（陡峭成長）
 * - Lv.46-50: 1000 億到 6 兆 TWD（馬斯克等級）
 */
const generateRPGLevels = () => {
  const levels: Array<{ threshold: number; tier: number }> = [];

  // Lv.1-10: 線性成長，0 到 10,000 TWD
  for (let i = 0; i < 10; i++) {
    const threshold = Math.round((i / 9) * 10000);
    const tier = i < 3 ? 1 : i < 6 ? 2 : i < 9 ? 3 : 4;
    levels.push({ threshold, tier });
  }

  // Lv.11-30: 指數成長，從 10,000 到 100,000,000 TWD (1 億)
  // 使用指數函數：y = 10000 * (100000000/10000)^((x-10)/19)
  // 確保 Lv.11 從 10,001 開始，避免與 Lv.10 重複
  for (let i = 10; i < 30; i++) {
    const progress = (i - 10) / 19; // 0 到 1
    const baseThreshold = 10000 * Math.pow(10000, progress);
    const threshold = Math.round(baseThreshold) + (i === 10 ? 1 : 0); // Lv.11 至少比 Lv.10 多 1
    const tier = i < 15 ? 4 : i < 20 ? 5 : i < 25 ? 6 : 7;
    levels.push({ threshold, tier });
  }

  // Lv.31-45: 陡峭成長，從 100,000,000 到 100,000,000,000 TWD (1000 億)
  // 使用指數函數：y = 100000000 * (100000000000/100000000)^((x-30)/14)
  // 確保 Lv.31 從 100,000,001 開始，避免與 Lv.30 重複
  for (let i = 30; i < 45; i++) {
    const progress = (i - 30) / 14; // 0 到 1
    const baseThreshold = 100000000 * Math.pow(1000, progress);
    const threshold = Math.round(baseThreshold) + (i === 30 ? 1 : 0); // Lv.31 至少比 Lv.30 多 1
    const tier = i < 35 ? 7 : i < 40 ? 8 : 9;
    levels.push({ threshold, tier });
  }

  // Lv.46-50: 馬斯克等級，從 1000 億到 6 兆 TWD
  // 使用指數函數：y = 100000000000 * (6000000000000/100000000000)^((x-45)/4)
  // 確保 Lv.46 從 100,000,000,001 開始，避免與 Lv.45 重複
  for (let i = 45; i < 50; i++) {
    const progress = (i - 45) / 4; // 0 到 1
    const baseThreshold = 100000000000 * Math.pow(60, progress);
    const threshold = Math.round(baseThreshold) + (i === 45 ? 1 : 0); // Lv.46 至少比 Lv.45 多 1
    levels.push({ threshold, tier: 10 });
  }

  // 確保所有門檻值嚴格遞增
  for (let i = 1; i < levels.length; i++) {
    if (levels[i].threshold <= levels[i - 1].threshold) {
      levels[i].threshold = levels[i - 1].threshold + 1;
    }
  }

  return levels;
};

// RPG 等級系統閾值 (50 階) - 台幣版本
export const RPG_LEVELS_TW = generateRPGLevels() as ReadonlyArray<{
  threshold: number;
  tier: number;
}>;

// 邏輯：EN 門檻 = TW 門檻 / 15 (將美金難度提高兩倍，以符合高薪物價)
export const RPG_LEVELS_EN = RPG_LEVELS_TW.map((lv) => ({
  ...lv,
  threshold: Math.round(lv.threshold / 15),
}));

// 鑽石藍色調觸發閾值 (台幣) - 對應 Tier 5 的最低門檻
export const DIAMOND_THRESHOLD_TW =
  RPG_LEVELS_TW.find((lv) => lv.tier === 5)?.threshold || 30000;
// 鑽石藍色調觸發閾值 (美金)
export const DIAMOND_THRESHOLD_EN = Math.round(DIAMOND_THRESHOLD_TW / 15);

// 向後兼容：保留舊的常數名稱（使用 TW 版本）
export const DIAMOND_THRESHOLD = DIAMOND_THRESHOLD_TW;

// 匯率常數：台幣對美金的匯率
export const EXCHANGE_RATE = 30;

// Tier 圖標映射 (擴充至 Tier 10)
export const TIER_ICONS: Record<number, string> = {
  1: "🥉",
  2: "🥉",
  3: "🥈",
  4: "🥇",
  5: "💎",
  6: "💠",
  7: "⚡",
  8: "🌟",
  9: "🚀",
  10: "🪐",
};

// Tier 顏色映射 (擴充至 Tier 10)
export const TIER_COLORS: Record<number, string> = {
  1: "#888", // 灰色 - 菜鳥
  2: "#cd7f32", // 古銅色
  3: "#c0c0c0", // 銀色
  4: "#ffd700", // 金色
  5: "#00bfff", // 鑽石藍
  6: "#9370db", // 紫色 - 神秘
  7: "#ff1493", // 深粉紅 - 電漿
  8: "#ffd700", // 星金色 - 閃耀
  9: "#ff4500", // 橙紅色 - 火箭
  10: "#8a2be2", // 藍紫色 - 星系
};

/**
 * 根據 tier 獲取對應的圖標
 */
export const getTierIcon = (tier: number): string => {
  return TIER_ICONS[tier] || "🥉";
};

/**
 * 根據 tier 獲取對應的顏色
 */
export const getTierColor = (tier: number): string => {
  return TIER_COLORS[tier] || "#888";
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  START_TIMESTAMP: "alchemy_start_timestamp",
  TOTAL_EARNED: "alchemy_total_earned",
  MONTHLY_SALARY: "user_monthly_salary",
  DAILY_HOURS: "user_daily_hours",
  WORKING_DAYS: "user_working_days",
  LOCALE: "user_locale",
} as const;
