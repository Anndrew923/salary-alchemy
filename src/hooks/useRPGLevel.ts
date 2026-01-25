import { useMemo } from 'react';
import { useAlchemyStore } from '../stores/alchemyStore';
import { useUserStore } from '../stores/userStore';
import { RPG_LEVELS, DIAMOND_THRESHOLD } from '../utils/constants';

export const useRPGLevel = () => {
  const { totalEarned } = useAlchemyStore();
  const { locale } = useUserStore();

  const level = useMemo(() => {
    if (totalEarned >= RPG_LEVELS.ALCHEMY_MASTER.threshold) {
      return {
        ...RPG_LEVELS.ALCHEMY_MASTER,
        title: locale === 'TW' ? RPG_LEVELS.ALCHEMY_MASTER.title : RPG_LEVELS.ALCHEMY_MASTER.titleEn,
      };
    } else if (totalEarned >= RPG_LEVELS.SENIOR_LOAFER.threshold) {
      return {
        ...RPG_LEVELS.SENIOR_LOAFER,
        title: locale === 'TW' ? RPG_LEVELS.SENIOR_LOAFER.title : RPG_LEVELS.SENIOR_LOAFER.titleEn,
      };
    } else if (totalEarned >= RPG_LEVELS.SALARY_THIEF.threshold) {
      return {
        ...RPG_LEVELS.SALARY_THIEF,
        title: locale === 'TW' ? RPG_LEVELS.SALARY_THIEF.title : RPG_LEVELS.SALARY_THIEF.titleEn,
      };
    } else {
      return {
        ...RPG_LEVELS.INTERN,
        title: locale === 'TW' ? RPG_LEVELS.INTERN.title : RPG_LEVELS.INTERN.titleEn,
      };
    }
  }, [totalEarned, locale]);

  const isDiamondMode = useMemo(() => {
    return totalEarned >= DIAMOND_THRESHOLD;
  }, [totalEarned]);

  const nextLevelThreshold = useMemo(() => {
    if (totalEarned >= RPG_LEVELS.ALCHEMY_MASTER.threshold) {
      return null; // 已達最高等級
    } else if (totalEarned >= RPG_LEVELS.SENIOR_LOAFER.threshold) {
      return RPG_LEVELS.ALCHEMY_MASTER.threshold;
    } else if (totalEarned >= RPG_LEVELS.SALARY_THIEF.threshold) {
      return RPG_LEVELS.SENIOR_LOAFER.threshold;
    } else {
      return RPG_LEVELS.SALARY_THIEF.threshold;
    }
  }, [totalEarned]);

  return {
    level,
    isDiamondMode,
    nextLevelThreshold,
  };
};
