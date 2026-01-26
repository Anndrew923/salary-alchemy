import { useMemo, useRef, useEffect, useState } from 'react';
import { useAlchemyStore } from '../stores/alchemyStore';
import { useUserStore } from '../stores/userStore';
import { RPG_LEVELS, DIAMOND_THRESHOLD } from '../utils/constants';

export const useRPGLevel = () => {
  const { totalEarned } = useAlchemyStore();
  const { locale } = useUserStore();
  const previousLevelIndexRef = useRef<number>(-1);
  const [hasJustLeveledUp, setHasJustLeveledUp] = useState(false);

  // 使用陣列遍歷判定當前等級
  const currentLevelIndex = useMemo(() => {
    for (let i = RPG_LEVELS.length - 1; i >= 0; i--) {
      if (totalEarned >= RPG_LEVELS[i].threshold) {
        return i;
      }
    }
    return 0;
  }, [totalEarned]);

  // 監控等級變化
  useEffect(() => {
    if (previousLevelIndexRef.current === -1) {
      previousLevelIndexRef.current = currentLevelIndex;
      return;
    }
    
    if (currentLevelIndex > previousLevelIndexRef.current) {
      setHasJustLeveledUp(true);
      // 重置標記，避免持續觸發
      setTimeout(() => {
        setHasJustLeveledUp(false);
      }, 100);
    }
    
    previousLevelIndexRef.current = currentLevelIndex;
  }, [currentLevelIndex]);

  const level = useMemo(() => {
    const levelData = RPG_LEVELS[currentLevelIndex];
    return {
      ...levelData,
      title: locale === 'TW' ? levelData.title : levelData.titleEn,
      index: currentLevelIndex,
    };
  }, [currentLevelIndex, locale]);

  const isDiamondMode = useMemo(() => {
    return totalEarned >= DIAMOND_THRESHOLD;
  }, [totalEarned]);

  const nextLevelThreshold = useMemo(() => {
    if (currentLevelIndex >= RPG_LEVELS.length - 1) {
      return null; // 已達最高等級
    }
    return RPG_LEVELS[currentLevelIndex + 1].threshold;
  }, [currentLevelIndex]);

  const amountToNextLevel = useMemo(() => {
    if (!nextLevelThreshold) return null;
    return nextLevelThreshold - totalEarned;
  }, [nextLevelThreshold, totalEarned]);

  const currentTier = useMemo(() => {
    return level.tier;
  }, [level.tier]);

  return {
    level,
    isDiamondMode,
    nextLevelThreshold,
    amountToNextLevel,
    currentTier,
    hasJustLeveledUp,
  };
};
