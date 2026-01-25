import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';

interface AlchemyState {
  startTimestamp: number | null;
  isRunning: boolean;
  totalEarned: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  calculateEarned: (ratePerSecond: number) => number;
  addToTotal: (amount: number) => void;
}

export const useAlchemyStore = create<AlchemyState>()(
  persist(
    (set, get) => ({
      startTimestamp: null,
      isRunning: false,
      totalEarned: 0,
      
      start: () => {
        const now = Date.now();
        set({ 
          startTimestamp: now,
          isRunning: true,
        });
        // 儲存到 localStorage
        localStorage.setItem(STORAGE_KEYS.START_TIMESTAMP, now.toString());
      },
      
      pause: () => {
        const { startTimestamp } = get();
        if (startTimestamp) {
          set({ isRunning: false });
          // 注意：實際的收益計算會在組件中處理，因為需要 ratePerSecond
        }
      },
      
      reset: () => {
        set({ 
          startTimestamp: null,
          isRunning: false,
        });
        localStorage.removeItem(STORAGE_KEYS.START_TIMESTAMP);
      },
      
      calculateEarned: (ratePerSecond: number) => {
        const { startTimestamp, isRunning } = get();
        if (!startTimestamp || !isRunning) return 0;
        
        const now = Date.now();
        const elapsedSeconds = (now - startTimestamp) / 1000;
        return ratePerSecond * elapsedSeconds;
      },
      
      addToTotal: (amount: number) => {
        set((state) => {
          const newTotal = state.totalEarned + amount;
          localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, newTotal.toString());
          return { totalEarned: newTotal };
        });
      },
    }),
    {
      name: 'salary-alchemy-alchemy',
      partialize: (state) => ({
        totalEarned: state.totalEarned,
      }),
    }
  )
);
