import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../utils/i18n';

interface UserState {
  monthlySalary: number;
  monthlyHours: number;
  dailyHours: number;
  locale: Locale;
  setMonthlySalary: (salary: number) => void;
  setMonthlyHours: (hours: number) => void;
  setDailyHours: (hours: number) => void;
  setLocale: (locale: Locale) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      monthlySalary: 0,
      monthlyHours: 160, // 預設每月 160 小時
      dailyHours: 8, // 預設每日 8 小時
      locale: 'TW',
      setMonthlySalary: (salary) => set({ monthlySalary: salary }),
      setMonthlyHours: (hours) => set({ monthlyHours: hours }),
      setDailyHours: (hours) => set({ dailyHours: hours }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'salary-alchemy-user',
      partialize: (state) => ({
        monthlySalary: state.monthlySalary,
        monthlyHours: state.monthlyHours,
        dailyHours: state.dailyHours,
        locale: state.locale,
      }),
    }
  )
);
