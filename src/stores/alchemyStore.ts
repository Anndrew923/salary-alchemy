import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { STORAGE_KEYS, EXCHANGE_RATE } from '../utils/constants';
import { db, auth, isFirebaseEnabled } from '../config/firebase';
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
  resetTotalEarned: () => Promise<void>;
  syncToCloud: () => Promise<void>;
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
      
      syncToCloud: async () => {
        if (!isFirebaseEnabled() || !db) {
          return;
        }

        try {
          const userState = useUserStore.getState();
          let uid = userState.uid;
          const nickname = userState.nickname;
          const locale = userState.locale;
          const { totalEarned } = get();

          // 重試機制：如果執行時未認證，先執行登入再同步
          if (!uid || (auth && !auth.currentUser)) {
            // 檢查是否已看過隱私協議
            if (!userState.hasSeenPrivacyNotice) {
              // 如果檢查到 !hasSeenPrivacyNotice，直接調用 setPrivacyModalOpen(true) 彈出協議
              useUserStore.getState().setPrivacyModalOpen(true);
              return;
            }

            // 如果 Firebase 已啟用，執行匿名登入
            if (auth) {
              try {
                const userCredential = await signInAnonymously(auth);
                uid = userCredential.user.uid;
                useUserStore.getState().setUid(uid);
                useUserStore.getState().setAnonymousId(uid);
                console.log('syncToCloud: Auto sign-in successful, retrying sync:', uid);
              } catch (error) {
                console.error('syncToCloud: Auto sign-in failed:', error);
                return;
              }
            } else {
              console.warn('Cannot sync: user not authenticated and auth not available');
              return;
            }
          }

          // 計算 normalizedScore（公平排名算法）
          // 統一轉換回台幣，確保全球社畜在同一個天平上競爭
          // TW 模式：score = totalEarned（已經是台幣）
          // EN 模式：score = totalEarned * EXCHANGE_RATE（美金轉台幣）
          const normalizedScore = locale === 'TW' ? totalEarned : totalEarned * EXCHANGE_RATE;

          // 同步到 leaderboard 集合
          await setDoc(
            doc(db, 'leaderboard', uid),
            {
              anonymousId: uid,
              nickname: nickname || 'Anonymous Alchemist',
              totalEarned: totalEarned,
              normalizedScore: normalizedScore,
              locale: locale,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          console.log('Successfully synced to cloud:', { uid, totalEarned, normalizedScore });
        } catch (error) {
          console.error('Failed to sync to Firestore:', error);
        }
      },

      finishSession: async (earned: number) => {
        // 結算金額入帳
        if (earned > 0) {
          const { totalEarned } = get();
          const newTotal = totalEarned + earned;
          set({ totalEarned: newTotal });
          localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, newTotal.toString());
          
          // 同步到雲端（在 finishSession 成功後觸發）
          await get().syncToCloud();
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
          
          // 同步到雲端
          get().syncToCloud().catch((error) => {
            console.error('Failed to sync after addToTotal:', error);
          });
          
          return { totalEarned: newTotal };
        });
      },
      
      resetTotalEarned: async () => {
        // 本地重置
        set({ totalEarned: 0 });
        localStorage.setItem(STORAGE_KEYS.TOTAL_EARNED, '0');
        
        // 云端同步重置
        if (isFirebaseEnabled() && db) {
          try {
            const userState = useUserStore.getState();
            let uid = userState.uid;
            
            // 如果未認證，先執行匿名登入
            if (!uid || (auth && !auth.currentUser)) {
              if (!userState.hasSeenPrivacyNotice) {
                useUserStore.getState().setPrivacyModalOpen(true);
                return;
              }
              
              if (auth) {
                try {
                  const userCredential = await signInAnonymously(auth);
                  uid = userCredential.user.uid;
                  useUserStore.getState().setUid(uid);
                  useUserStore.getState().setAnonymousId(uid);
                } catch (error) {
                  console.error('resetTotalEarned: Auto sign-in failed:', error);
                  return;
                }
              } else {
                console.warn('Cannot reset cloud: auth not available');
                return;
              }
            }
            
            // 更新云端數據：將 totalEarned 和 normalizedScore 設為 0
            // 稱號會自動根據 normalizedScore 重置為最低等級
            await updateDoc(
              doc(db, 'leaderboard', uid),
              {
                totalEarned: 0,
                normalizedScore: 0,
                updatedAt: new Date().toISOString(),
              }
            );
            
            console.log('Successfully reset cloud data:', { uid });
          } catch (error) {
            console.error('Failed to reset cloud data:', error);
          }
        }
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
