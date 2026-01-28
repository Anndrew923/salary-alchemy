import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../config/firebase';
import { calculateLevelFromNormalizedScore } from './useRPGLevel';
import { LEVEL_TITLES } from '../utils/constants';

export interface LeaderboardEntry {
  uid: string;
  nickname: string;
  totalEarned: number;
  normalizedScore: number;
  locale?: 'TW' | 'EN';
  rank: number;
  tier: number;
  levelTitle: string;
  updatedAt?: string;
}

interface UseLeaderboardOptions {
  hasSeenPrivacyNotice: boolean;
  locale: 'TW' | 'EN';
  limitCount?: number;
}

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

/**
 * 抽離 Firebase 排行榜數據抓取邏輯
 */
export const useLeaderboard = ({
  hasSeenPrivacyNotice,
  locale,
  limitCount = 50,
}: UseLeaderboardOptions): UseLeaderboardResult => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!hasSeenPrivacyNotice) {
        setLoading(false);
        return;
      }

      if (!isFirebaseEnabled() || !db) {
        setLoading(false);
        setError('Firebase is not configured. Please set VITE_FIREBASE_* environment variables to enable leaderboard.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        try {
          const countSnapshot = await getCountFromServer(collection(db, 'leaderboard'));
          setTotalCount(countSnapshot.data().count);
        } catch (countError) {
          console.warn('Failed to get total count:', countError);
        }

        const q = query(
          collection(db, 'leaderboard'),
          orderBy('normalizedScore', 'desc'),
          limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboardData: LeaderboardEntry[] = [];
        const titles = locale === 'TW' ? LEVEL_TITLES.TW : LEVEL_TITLES.EN;

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const totalEarned = data.totalEarned || 0;
          const normalizedScore = data.normalizedScore || 0;
          const userLocale = data.locale || 'TW';
          const updatedAt = data.updatedAt || null;
          
          const { tier, index: levelIndex } = calculateLevelFromNormalizedScore(normalizedScore);
          
          leaderboardData.push({
            uid: docSnapshot.id,
            nickname: data.nickname || 'Anonymous Alchemist',
            totalEarned,
            normalizedScore,
            locale: userLocale,
            rank: leaderboardData.length + 1,
            tier,
            levelTitle: titles[levelIndex] || titles[0],
            updatedAt,
          });
        });

        setEntries(leaderboardData);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please check Firebase configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [hasSeenPrivacyNotice, locale, limitCount]);

  return {
    entries,
    loading,
    error,
    totalCount,
  };
};
