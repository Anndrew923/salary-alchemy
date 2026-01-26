import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth, isFirebaseEnabled } from '../../config/firebase';
import { useUserStore } from '../../stores/userStore';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { RPG_LEVELS_TW, RPG_LEVELS_EN, LEVEL_TITLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/i18n';
import zhTW from '../../locales/zh-TW.json';
import enUS from '../../locales/en-US.json';
import styles from './Leaderboard.module.css';

interface LeaderboardEntry {
  uid: string;
  nickname: string;
  totalEarned: number;
  normalizedScore: number;
  locale?: string;
  rank: number;
  tier: number;
  levelTitle: string;
  updatedAt?: string;
}

const Leaderboard = () => {
  const { locale, uid: currentUid, hasSeenPrivacyNotice, setUid, setAnonymousId, setPrivacyModalOpen, setShouldNavigateToLeaderboard } = useUserStore();
  const { totalEarned: currentTotalEarned } = useAlchemyStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShieldTooltip, setShowShieldTooltip] = useState(false);

  const translations = locale === 'TW' ? zhTW : enUS;
  const privacy = translations.privacy;

  // 組件掛載時，強制攔截：檢查隱私協議狀態
  // 如果用戶直接通過 URL 進入排行榜但未簽署，必須強制開啟 PrivacyNoticeModal
  useEffect(() => {
    if (!hasSeenPrivacyNotice) {
      setShouldNavigateToLeaderboard(true); // 標記簽署後應該導向排行榜
      setPrivacyModalOpen(true);
    }
  }, [hasSeenPrivacyNotice, setPrivacyModalOpen, setShouldNavigateToLeaderboard]);

  // 自動登入補償：如果標記為 true 但 Firebase 尚未登入，立即觸發 signInAnonymously()
  useEffect(() => {
    const performSignIn = async () => {
      // 如果未簽署，等待 Modal 處理
      if (!hasSeenPrivacyNotice) {
        return;
      }

      // 如果 Firebase 未啟用，跳過
      if (!isFirebaseEnabled() || !auth) {
        return;
      }

      // 檢查 Firebase auth.currentUser 是否為空
      const isAuthenticated = auth.currentUser !== null;
      
      // 如果已經有 uid 且 Firebase 已認證，跳過
      if (currentUid && isAuthenticated) {
        return;
      }

      // 如果標記為 true 但尚未登入（uid 為空或 auth.currentUser 為空），立即觸發登入
      try {
        const userCredential = await signInAnonymously(auth);
        const userUid = userCredential.user.uid;
        setUid(userUid);
        setAnonymousId(userUid);
        console.log('Leaderboard: Auto sign-in successful:', userUid);
      } catch (error) {
        console.error('Leaderboard: Auto sign-in failed:', error);
        // 不阻止應用運行
      }
    };

    performSignIn();
  }, [hasSeenPrivacyNotice, currentUid, setUid, setAnonymousId]);

  // 根據 totalEarned 計算等級和 tier（用於當前用戶顯示）
  const calculateLevel = useMemo(() => {
    return (totalEarned: number) => {
      const RPG_LEVELS = locale === 'TW' ? RPG_LEVELS_TW : RPG_LEVELS_EN;
      
      for (let i = RPG_LEVELS.length - 1; i >= 0; i--) {
        if (totalEarned >= RPG_LEVELS[i].threshold) {
          return {
            index: i,
            tier: RPG_LEVELS[i].tier,
          };
        }
      }
      return { index: 0, tier: 1 };
    };
  }, [locale]);

  // 根據 normalizedScore 計算等級和 tier（用於排行榜，因為 normalizedScore 已標準化為 TW 模式）
  const calculateLevelFromNormalizedScore = useMemo(() => {
    return (normalizedScore: number) => {
      // normalizedScore 已經標準化，所以始終使用 TW 門檻
      for (let i = RPG_LEVELS_TW.length - 1; i >= 0; i--) {
        if (normalizedScore >= RPG_LEVELS_TW[i].threshold) {
          return {
            index: i,
            tier: RPG_LEVELS_TW[i].tier,
          };
        }
      }
      return { index: 0, tier: 1 };
    };
  }, []);

  // 獲取等級標題
  const getLevelTitle = useMemo(() => {
    return (levelIndex: number) => {
      const titles = locale === 'TW' ? LEVEL_TITLES.TW : LEVEL_TITLES.EN;
      return titles[levelIndex] || titles[0];
    };
  }, [locale]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // 如果未簽署隱私協議，不抓取數據
      if (!hasSeenPrivacyNotice) {
        setLoading(false);
        return;
      }

      // 如果 Firebase 未啟用，顯示提示
      if (!isFirebaseEnabled() || !db) {
        setLoading(false);
        setError(translations.error || 'Firebase is not configured. Please set VITE_FIREBASE_* environment variables to enable leaderboard.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, 'leaderboard'),
          orderBy('normalizedScore', 'desc'),
          limit(50)
        );

        const querySnapshot = await getDocs(q);
        const leaderboardData: LeaderboardEntry[] = [];

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const totalEarned = data.totalEarned || 0;
          const normalizedScore = data.normalizedScore || 0;
          const userLocale = data.locale || 'TW';
          const updatedAt = data.updatedAt || null;
          
          // 根據 normalizedScore 計算 tier（使用 TW 門檻，因為 normalizedScore 已經標準化）
          const { tier, index: levelIndex } = calculateLevelFromNormalizedScore(normalizedScore);
          
          leaderboardData.push({
            uid: docSnapshot.id,
            nickname: data.nickname || 'Anonymous Alchemist',
            totalEarned,
            normalizedScore,
            locale: userLocale,
            rank: leaderboardData.length + 1,
            tier,
            levelTitle: getLevelTitle(levelIndex),
            updatedAt,
          });
        });

        setEntries(leaderboardData);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(translations.error || 'Failed to load leaderboard. Please check Firebase configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [hasSeenPrivacyNotice, currentUid, locale, calculateLevel, calculateLevelFromNormalizedScore, getLevelTitle]);

  const getTierIcon = (tier: number) => {
    const icons = {
      1: '🥉',
      2: '🥉',
      3: '🥈',
      4: '🥇',
      5: '💎',
    };
    return icons[tier as keyof typeof icons] || '🥉';
  };

  const getTierColor = (tier: number) => {
    const colors = {
      1: '#888',
      2: '#cd7f32',
      3: '#c0c0c0',
      4: '#ffd700',
      5: '#00bfff',
    };
    return colors[tier as keyof typeof colors] || '#888';
  };

  // 計算當前用戶的排名
  const currentUserRank = entries.findIndex(entry => entry.uid === currentUid) + 1;
  const currentUserEntry = entries.find(entry => entry.uid === currentUid);
  const { tier: currentTier, index: currentLevelIndex } = calculateLevel(currentTotalEarned);

  return (
    <div className={styles.container}>
      {/* 未簽署隱私協議時，不顯示任何排行榜內容 */}
      {!hasSeenPrivacyNotice && (
        <div className={styles.loading}>{translations.privacyNoticeRequired}</div>
      )}

      {hasSeenPrivacyNotice && loading && (
        <div className={styles.loading}>{translations.loading}</div>
      )}

      {hasSeenPrivacyNotice && error && (
        <div className={styles.error}>{error}</div>
      )}

      {hasSeenPrivacyNotice && !loading && !error && (
        <>
      
      <div className={styles.header}>
        <h1 className={styles.title}>{translations.leaderboardTitle}</h1>
        
        {/* 匿名保護盾 */}
        <div 
          className={styles.shieldContainer}
          onMouseEnter={() => setShowShieldTooltip(true)}
          onMouseLeave={() => setShowShieldTooltip(false)}
          onTouchStart={() => setShowShieldTooltip(true)}
          onTouchEnd={() => setTimeout(() => setShowShieldTooltip(false), 2000)}
        >
          <div className={styles.shieldIcon}>🛡️</div>
          {showShieldTooltip && (
            <div className={styles.shieldTooltip}>
              {privacy.shieldTooltip}
            </div>
          )}
        </div>
      </div>
      
      {/* 當前用戶資訊 */}
      {currentUid && (
        <div className={`${styles.currentUser} ${currentTier === 5 ? styles.diamondMode : ''}`}>
          <div className={styles.currentUserLabel}>{translations.yourRank}</div>
          <div className={styles.currentUserInfo}>
            <span className={styles.rank}>#{currentUserRank || '?'}</span>
            <span className={styles.nickname}>{currentUserEntry?.nickname || (locale === 'TW' ? '你' : 'You')}</span>
            <span className={styles.amount}>{formatCurrency(currentTotalEarned, locale)}</span>
            <span 
              className={styles.tierBadge}
              style={{ color: getTierColor(currentTier) }}
            >
              {getTierIcon(currentTier)} {getLevelTitle(currentLevelIndex)}
            </span>
          </div>
        </div>
      )}

      {/* 排行榜列表 */}
      <div className={styles.leaderboard}>
        {entries.map((entry) => (
          <div
            key={entry.uid}
            className={`${styles.entry} ${entry.uid === currentUid ? styles.currentUserEntry : ''} ${entry.tier === 5 ? styles.diamondEntry : ''}`}
          >
            <div className={styles.rank}>{entry.rank}</div>
            <div className={styles.tierIcon} style={{ color: getTierColor(entry.tier) }}>
              {getTierIcon(entry.tier)}
            </div>
            <div className={styles.info}>
              <div className={styles.nickname}>{entry.nickname}</div>
              <div className={styles.levelTitle}>{entry.levelTitle}</div>
            </div>
            <div className={styles.amount}>{formatCurrency(entry.totalEarned, (entry.locale === 'TW' || entry.locale === 'EN') ? entry.locale : locale)}</div>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default Leaderboard;
