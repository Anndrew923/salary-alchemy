import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../utils/i18n';
import { EXCHANGE_RATE } from '../utils/constants';
import { useAlchemyStore } from './alchemyStore';

interface UserState {
  monthlySalary: number;
  dailyHours: number;
  workingDays: number;
  locale: Locale;
  uid: string | null;
  nickname: string;
  hasSeenPrivacyNotice: boolean;
  anonymousId: string | null;
  setMonthlySalary: (salary: number) => void;
  setDailyHours: (hours: number) => void;
  setWorkingDays: (days: number) => void;
  setLocale: (locale: Locale) => void;
  setUid: (uid: string) => void;
  setNickname: (nickname: string) => void;
  setHasSeenPrivacyNotice: (seen: boolean) => void;
  setAnonymousId: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      monthlySalary: 0,
      dailyHours: 8, // 預設每日 8 小時
      workingDays: 20, // 預設每月 20 個工作天
      locale: 'TW',
      uid: null,
      nickname: 'Anonymous Alchemist',
      hasSeenPrivacyNotice: false,
      anonymousId: null,
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
        localStorage.setItem('alchemy_total_earned', convertedTotalEarned.toString());
        
        // 更新 locale
        set({ locale: newLocale });
      },
      setUid: (uid) => set({ uid }),
      setNickname: (nickname) => set({ nickname }),
      setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
      setAnonymousId: (id) => set({ anonymousId: id }),
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
      }),
    }
  )
);
