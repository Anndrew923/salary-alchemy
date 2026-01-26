import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../utils/i18n';

interface UserState {
  monthlySalary: number;
  dailyHours: number;
  workingDays: number;
  locale: Locale;
  setMonthlySalary: (salary: number) => void;
  setDailyHours: (hours: number) => void;
  setWorkingDays: (days: number) => void;
  setLocale: (locale: Locale) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      monthlySalary: 0,
      dailyHours: 8, // 預設每日 8 小時
      workingDays: 20, // 預設每月 20 個工作天
      locale: 'TW',
      setMonthlySalary: (salary) => set({ monthlySalary: salary }),
      setDailyHours: (hours) => set({ dailyHours: hours }),
      setWorkingDays: (days) => set({ workingDays: days }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'salary-alchemy-user',
      partialize: (state) => ({
        monthlySalary: state.monthlySalary,
        dailyHours: state.dailyHours,
        workingDays: state.workingDays,
        locale: state.locale,
      }),
    }
  )
);
