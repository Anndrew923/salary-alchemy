import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../utils/i18n';
import { EXCHANGE_RATE, STORAGE_KEYS } from '../utils/constants';
import { useAlchemyStore } from './alchemyStore';

/** 單一物品蒐集記錄 */
export interface UnlockedItemRecord {
  count: number;
  unlockedAt: number;
}

interface UserState {
  monthlySalary: number;
  dailyHours: number;
  workingDays: number;
  locale: Locale;
  uid: string | null;
  nickname: string;
  hasSeenPrivacyNotice: boolean;
  anonymousId: string | null;
  isPrivacyModalOpen: boolean;
  shouldNavigateToLeaderboard: boolean;
  /** 鍊金手札：已解鎖物品 itemId -> { 獲得次數, 首次解鎖時間 } */
  unlockedItems: Record<string, UnlockedItemRecord>;
  setMonthlySalary: (salary: number) => void;
  setDailyHours: (hours: number) => void;
  setWorkingDays: (days: number) => void;
  setLocale: (locale: Locale) => void;
  setUid: (uid: string) => void;
  setNickname: (nickname: string) => void;
  setHasSeenPrivacyNotice: (seen: boolean) => void;
  setAnonymousId: (id: string) => void;
  setPrivacyModalOpen: (open: boolean) => void;
  setShouldNavigateToLeaderboard: (should: boolean) => void;
  /** 蒐集物品：若已存在則 count++，否則新增記錄 */
  collectItem: (itemId: string) => void;
  /** 累計解鎖里程碑：已發放到的 totalEarned 門檻（TWD），用於每 N TWD 解鎖一項高階物品 */
  lastMilestoneTotalEarned: number;
  setLastMilestoneTotalEarned: (value: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      monthlySalary: 0,
      dailyHours: 8,
      workingDays: 20,
      locale: 'TW',
      uid: null,
      nickname: 'Anonymous Alchemist',
      hasSeenPrivacyNotice: false,
      anonymousId: null,
      isPrivacyModalOpen: false,
      shouldNavigateToLeaderboard: false,
      unlockedItems: {},
      lastMilestoneTotalEarned: 0,
      setLastMilestoneTotalEarned: (value) => set({ lastMilestoneTotalEarned: value }),
      collectItem: (itemId) => {
        const id = typeof itemId === "string" ? itemId.trim() : "";
        if (!id) return;
        set((state) => {
          const now = Date.now();
          const prev = state.unlockedItems[id];
          return {
            unlockedItems: {
              ...state.unlockedItems,
              [id]: prev
                ? { count: prev.count + 1, unlockedAt: prev.unlockedAt }
                : { count: 1, unlockedAt: now },
            },
          };
        });
      },
      setMonthlySalary: (salary) => set({ monthlySalary: salary }),
      setDailyHours: (hours) => set({ dailyHours: hours }),
      setWorkingDays: (days) => set({ workingDays: days }),
      setLocale: (newLocale) => {
        const currentState = useUserStore.getState();
        const currentLocale = currentState.locale;
        
        // 如果語系沒有改變，直接返回
        if (currentLocale === newLocale) {
          return;
        }
        
        // 取得目前的 totalEarned
        const alchemyState = useAlchemyStore.getState();
        const currentTotalEarned = alchemyState.totalEarned;
        
        // 執行匯率換算
        let convertedTotalEarned = currentTotalEarned;
        if (currentLocale === 'TW' && newLocale === 'EN') {
          // 從台幣切換到美金：金額除以匯率
          convertedTotalEarned = currentTotalEarned / EXCHANGE_RATE;
        } else if (currentLocale === 'EN' && newLocale === 'TW') {
          // 從美金切換到台幣：金額乘以匯率
          convertedTotalEarned = currentTotalEarned * EXCHANGE_RATE;
        }
        
        // 更新 alchemyStore 中的 totalEarned
        useAlchemyStore.setState({ totalEarned: convertedTotalEarned });
        localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, convertedTotalEarned.toString());
        
        // 更新 locale
        set({ locale: newLocale });
      },
      setUid: (uid) => set({ uid }),
      setNickname: (nickname) => set({ nickname }),
      setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
      setAnonymousId: (id) => set({ anonymousId: id }),
      setPrivacyModalOpen: (open) => set({ isPrivacyModalOpen: open }),
      setShouldNavigateToLeaderboard: (should) => set({ shouldNavigateToLeaderboard: should }),
    }),
    {
      name: 'salary-alchemy-user',
      partialize: (state) => ({
        monthlySalary: state.monthlySalary,
        dailyHours: state.dailyHours,
        workingDays: state.workingDays,
        locale: state.locale,
        uid: state.uid,
        nickname: state.nickname,
        hasSeenPrivacyNotice: state.hasSeenPrivacyNotice,
        anonymousId: state.anonymousId,
        unlockedItems: state.unlockedItems,
        lastMilestoneTotalEarned: state.lastMilestoneTotalEarned,
      }),
    }
  )
);
