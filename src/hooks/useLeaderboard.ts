import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "../config/firebase";
import { calculateLevelFromNormalizedScore } from "./useRPGLevel";
import { LEVEL_TITLES } from "../utils/constants";

export interface LeaderboardEntry {
  uid: string;
  nickname: string;
  totalEarned: number;
  normalizedScore: number;
  locale?: "TW" | "EN";
  rank: number;
  tier: number;
  levelTitle: string;
  updatedAt?: string;
}

interface UseLeaderboardOptions {
  hasSeenPrivacyNotice: boolean;
  locale: "TW" | "EN";
  limitCount?: number;
}

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
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
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!hasSeenPrivacyNotice) {
        setLoading(false);
        return;
      }

      if (!isFirebaseEnabled() || !db) {
        setLoading(false);
        setError(
          "Firebase is not configured. Please set VITE_FIREBASE_* environment variables to enable leaderboard.",
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);

        try {
          const countSnapshot = await getCountFromServer(
            collection(db, "leaderboard"),
          );
          setTotalCount(countSnapshot.data().count);
        } catch (countError) {
          console.warn("Failed to get total count:", countError);
        }

        const q = query(
          collection(db, "leaderboard"),
          orderBy("normalizedScore", "desc"),
          limit(limitCount),
        );

        const querySnapshot = await getDocs(q);
        const leaderboardData: LeaderboardEntry[] = [];
        const titles = locale === "TW" ? LEVEL_TITLES.TW : LEVEL_TITLES.EN;

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const totalEarned = data.totalEarned || 0;
          const normalizedScore = data.normalizedScore || 0;
          const userLocale = data.locale || "TW";
          const updatedAt = data.updatedAt || null;

          const { tier, index: levelIndex } =
            calculateLevelFromNormalizedScore(normalizedScore);

          leaderboardData.push({
            uid: docSnapshot.id,
            nickname: data.nickname || "Anonymous Alchemist",
            totalEarned,
            normalizedScore,
            locale: userLocale,
            rank: leaderboardData.length + 1,
            tier,
            levelTitle: titles[levelIndex] || titles[0],
            updatedAt,
          });
        });

        // 更新 lastDoc 和 hasMore
        const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastDocument || null);
        setHasMore(querySnapshot.docs.length === 20);

        setEntries(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(
          "Failed to load leaderboard. Please check Firebase configuration.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [hasSeenPrivacyNotice, locale]);

  const fetchMore = async () => {
    if (!hasSeenPrivacyNotice || !lastDoc || !hasMore) {
      return;
    }

    if (!isFirebaseEnabled() || !db) {
      return;
    }

    try {
      const q = query(
        collection(db, "leaderboard"),
        orderBy("normalizedScore", "desc"),
        startAfter(lastDoc),
        limit(limitCount),
      );

      const querySnapshot = await getDocs(q);
      const titles = locale === "TW" ? LEVEL_TITLES.TW : LEVEL_TITLES.EN;
      const newEntries: LeaderboardEntry[] = [];

      querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot) => {
        const data = docSnapshot.data();
        const totalEarned = data.totalEarned || 0;
        const normalizedScore = data.normalizedScore || 0;
        const userLocale = data.locale || "TW";
        const updatedAt = data.updatedAt || null;

        const { tier, index: levelIndex } =
          calculateLevelFromNormalizedScore(normalizedScore);

        newEntries.push({
          uid: docSnapshot.id,
          nickname: data.nickname || "Anonymous Alchemist",
          totalEarned,
          normalizedScore,
          locale: userLocale,
          rank: 0, // 將在 setEntries 時計算
          tier,
          levelTitle: titles[levelIndex] || titles[0],
          updatedAt,
        });
      });

      // 更新 lastDoc 和 hasMore
      const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastDocument || null);
      setHasMore(querySnapshot.docs.length === 20);

      // 將新數據 concat 到現有 entries，並更新 rank
      setEntries((prevEntries) => {
        const updatedNewEntries = newEntries.map((entry, index) => ({
          ...entry,
          rank: prevEntries.length + index + 1,
        }));
        return [...prevEntries, ...updatedNewEntries];
      });
    } catch (err) {
      console.error("Error fetching more leaderboard entries:", err);
    }
  };

  return {
    entries,
    loading,
    error,
    totalCount,
    fetchMore,
    hasMore,
  };
};
