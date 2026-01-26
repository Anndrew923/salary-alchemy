import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc } from 'firebase/firestore';
import { STORAGE_KEYS } from '../utils/constants';
import { db, isFirebaseEnabled } from '../config/firebase';
import { useUserStore } from './userStore';

interface AlchemyState {
  startTimestamp: number | null;
  isRunning: boolean;
  totalEarned: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  finishSession: (earned: number) => Promise<void>;
  calculateEarned: (ratePerSecond: number) => number;
  addToTotal: (amount: number) => Promise<void>;
  resetTotalEarned: () => void;
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
      
      finishSession: async (earned: number) => {
        // 結算金額入帳
        if (earned > 0) {
          const { totalEarned } = get();
          const newTotal = totalEarned + earned;
          set({ totalEarned: newTotal });
          localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, newTotal.toString());
          
          // 同步到 Firestore（僅在 Firebase 啟用時）
          if (isFirebaseEnabled() && db) {
            try {
              const userState = useUserStore.getState();
              const uid = userState.uid;
              const nickname = userState.nickname;
              
              if (uid) {
                await setDoc(
                  doc(db, 'users', uid),
                  {
                    totalEarned: newTotal,
                    nickname: nickname,
                    updatedAt: new Date().toISOString(),
                  },
                  { merge: true }
                );
              }
            } catch (error) {
              console.error('Failed to sync to Firestore:', error);
            }
          }
        }
        // 重置當前計時
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
      
      addToTotal: async (amount: number) => {
        set((state) => {
          const newTotal = state.totalEarned + amount;
          localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, newTotal.toString());
          
          // 同步到 Firestore（僅在 Firebase 啟用時）
          if (isFirebaseEnabled() && db) {
            (async () => {
              try {
                const userState = useUserStore.getState();
                const uid = userState.uid;
                const nickname = userState.nickname;
                
                if (uid) {
                  await setDoc(
                    doc(db, 'users', uid),
                    {
                      totalEarned: newTotal,
                      nickname: nickname,
                      updatedAt: new Date().toISOString(),
                    },
                    { merge: true }
                  );
                }
              } catch (error) {
                console.error('Failed to sync to Firestore:', error);
              }
            })();
          }
          
          return { totalEarned: newTotal };
        });
      },
      
      resetTotalEarned: () => {
        set({ totalEarned: 0 });
        localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, '0');
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
