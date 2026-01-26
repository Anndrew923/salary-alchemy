import i18n from '../i18n/config';

export interface ExchangeResult {
  key: string;
  icon: string;
  type: 'HEALTH' | 'WEALTH';
}

export const getExchangeItem = (earned: number, minutes: number, currency: 'TWD' | 'USD'): ExchangeResult => {
  // 1. 優先判斷：健康風險 (Time-based)
  if (minutes > 45) return { key: 'health_critical', icon: '🚑', type: 'HEALTH' };
  if (minutes > 30) return { key: 'health_warning', icon: '🍩', type: 'HEALTH' };

  // 2. 財富判定：購買力點數 (PP)
  // USD 轉換：1 USD ≈ 30 TWD
  const pp = currency === 'USD' ? earned * 30 : earned;

  if (pp < 1) return { key: 'wealth_micro', icon: '💨', type: 'WEALTH' };
  if (pp < 10) return { key: 'wealth_tiny', icon: '🧻', type: 'WEALTH' };
  if (pp < 50) return { key: 'wealth_low', icon: '🍬', type: 'WEALTH' };
  if (pp < 160) return { key: 'wealth_mid_low', icon: '🥤', type: 'WEALTH' };
  if (pp < 300) return { key: 'wealth_mid', icon: '🍱', type: 'WEALTH' };
  if (pp < 1000) return { key: 'wealth_high', icon: '🎫', type: 'WEALTH' };
  if (pp < 3000) return { key: 'wealth_ultra', icon: '💊', type: 'WEALTH' };
  return { key: 'wealth_legendary', icon: '💎', type: 'WEALTH' };
};

export const getRandomExchangeMsg = (categoryKey: string): { item: string; desc: string } => {
  // 從 i18n 陣列隨機撈一句
  const messages = i18n.t(`exchange.${categoryKey}`, { returnObjects: true });
  if (Array.isArray(messages)) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomLine = messages[randomIndex] as string;
    const [item, desc] = randomLine.split('|').map(s => s.trim());
    return { item, desc };
  }
  return { item: "Unknown", desc: "Keep pooping." };
};
