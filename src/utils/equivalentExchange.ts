import i18n from "../i18n/config";
import zhTW from "../locales/zh-TW.json";
import enUS from "../locales/en-US.json";
import type { Locale } from "./i18n";

export interface ExchangeResult {
  key: string;
  icon: string;
  type: "HEALTH" | "WEALTH";
}

/** 單一物品回傳格式，含 i18n 陣列中的唯一 itemId */
export interface ExchangeMsgResult {
  item: string;
  desc: string;
  itemId: string;
}

export const getExchangeItem = (
  earned: number,
  minutes: number,
  currency: "TWD" | "USD",
): ExchangeResult => {
  // 1. 優先判斷：健康風險 (Time-based)
  if (minutes > 45)
    return { key: "health_critical", icon: "🚑", type: "HEALTH" };
  if (minutes > 30)
    return { key: "health_warning", icon: "🍩", type: "HEALTH" };

  // 2. 財富判定：購買力點數 (PP)
  // USD 轉換：1 USD ≈ 30 TWD
  const pp = currency === "USD" ? earned * 30 : earned;

  if (pp < 1) return { key: "wealth_micro", icon: "💨", type: "WEALTH" };
  if (pp < 10) return { key: "wealth_tiny", icon: "🧻", type: "WEALTH" };
  if (pp < 50) return { key: "wealth_low", icon: "🍬", type: "WEALTH" };
  if (pp < 160) return { key: "wealth_mid_low", icon: "🥤", type: "WEALTH" };
  if (pp < 300) return { key: "wealth_mid", icon: "🍱", type: "WEALTH" };
  if (pp < 1000) return { key: "wealth_high", icon: "🎫", type: "WEALTH" };
  if (pp < 3000) return { key: "wealth_ultra", icon: "💊", type: "WEALTH" };
  if (pp < 10000)
    return { key: "wealth_legendary", icon: "💎", type: "WEALTH" };
  return { key: "wealth_overlord", icon: "👑", type: "WEALTH" };
};

const CATEGORY_ICONS: Record<string, string> = {
  health_critical: "🚑",
  health_warning: "🍩",
  wealth_micro: "💨",
  wealth_tiny: "🧻",
  wealth_low: "🍬",
  wealth_mid_low: "🥤",
  wealth_mid: "🍱",
  wealth_high: "🎫",
  wealth_ultra: "💊",
  wealth_legendary: "💎",
  wealth_overlord: "👑",
  ad_legendary: "💎",
};

/** 由 categoryKey 或 itemId 取得對應圖示（用於收據/手札顯示） */
export const getIconForCategoryKey = (categoryKeyOrItemId: string): string => {
  const key = categoryKeyOrItemId.includes("_")
    ? categoryKeyOrItemId.replace(/_\d+$/, "")
    : categoryKeyOrItemId;
  return CATEGORY_ICONS[key] ?? "📜";
};

const getExchangeFromLocale = (locale: Locale) =>
  (locale === "TW" ? zhTW : enUS) as unknown as { exchange?: Record<string, string[]> };

/** 由 itemId 取得該物品的 item 名稱與 desc（用於手札詳情）；依 locale 顯示對應語系 */
export const getItemByItemId = (
  itemId: string,
  locale: Locale = "TW",
): { item: string; desc: string } | null => {
  const match = itemId.match(/^(.+)_(\d+)$/);
  if (!match) return null;
  const [, key, indexStr] = match;
  const index = parseInt(indexStr, 10);
  const exchange = getExchangeFromLocale(locale).exchange;
  const arr = exchange?.[key];
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) return null;
  const line = arr[index];
  if (typeof line !== "string") return null;
  const [item, desc] = line.split("|").map((s) => (s ?? "").trim());
  return { item: item || "?", desc: desc || "" };
};

/** 可選：排除已擁有的 itemId，用於廣告傳說「必定解鎖未擁有」 */
export const getRandomExchangeMsg = (
  categoryKey: string,
  isLegendary: boolean = false,
  options?: { excludeIds?: Set<string> },
): ExchangeMsgResult => {
  const targetKey = isLegendary ? "ad_legendary" : categoryKey;
  const messages = i18n.t(`exchange.${targetKey}`, { returnObjects: true });

  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      item: i18n.t("error.unknown"),
      desc: i18n.t("error.keepPooping"),
      itemId: `${targetKey}_0`,
    };
  }

  let indices: number[] = Array.from({ length: messages.length }, (_, i) => i);
  if (options?.excludeIds?.size && isLegendary && targetKey === "ad_legendary") {
    indices = indices.filter((i) => !options.excludeIds!.has(`${targetKey}_${i}`));
    if (indices.length === 0) indices = Array.from({ length: messages.length }, (_, i) => i);
  }
  const randomIndex = indices[Math.floor(Math.random() * indices.length)];
  const randomLine = messages[randomIndex] as string;
  const [item, desc] = randomLine.split("|").map((s) => (s ?? "").trim());
  const itemId = `${targetKey}_${randomIndex}`;
  return {
    item: item || i18n.t("error.unknown"),
    desc: desc || i18n.t("error.keepPooping"),
    itemId,
  };
};

/** 從 zh-TW 的 exchange 計算總物品數與各分類數量 */
export interface CollectionStats {
  total: number;
  byCategory: Record<string, number>;
  categoryOrder: string[];
}

export const getCollectionStats = (): CollectionStats => {
  const exchange = (zhTW as unknown as { exchange?: Record<string, unknown> }).exchange;
  if (!exchange) return { total: 0, byCategory: {}, categoryOrder: [] };

  const byCategory: Record<string, number> = {};
  const categoryOrder = [
    "wealth_micro",
    "wealth_tiny",
    "wealth_low",
    "wealth_mid_low",
    "wealth_mid",
    "wealth_high",
    "wealth_ultra",
    "wealth_legendary",
    "wealth_overlord",
    "health_warning",
    "health_critical",
    "ad_legendary",
  ];

  let total = 0;
  for (const key of Object.keys(exchange)) {
    if (key === "summonFailed") continue;
    const val = exchange[key];
    if (Array.isArray(val)) {
      byCategory[key] = val.length;
      total += val.length;
    }
  }
  return { total, byCategory, categoryOrder };
};

const HIGH_TIER_KEYS = ["wealth_legendary", "wealth_overlord"] as const;

/** 從高階分類中隨機選一個「尚未擁有」的 itemId；若全擁有則隨機一個 */
export const getRandomHighTierUnownedItemId = (
  unlockedItemIds: Set<string>,
): string => {
  const exchange = (zhTW as unknown as { exchange?: Record<string, string[]> }).exchange;
  if (!exchange) return "wealth_legendary_0";

  const candidates: string[] = [];
  for (const key of HIGH_TIER_KEYS) {
    const arr = exchange[key];
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        const id = `${key}_${i}`;
        if (!unlockedItemIds.has(id)) candidates.push(id);
      }
    }
  }
  if (candidates.length === 0) {
    for (const key of HIGH_TIER_KEYS) {
      const arr = exchange[key];
      if (Array.isArray(arr))
        for (let i = 0; i < arr.length; i++) candidates.push(`${key}_${i}`);
    }
  }
  return candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : "wealth_legendary_0";
};
