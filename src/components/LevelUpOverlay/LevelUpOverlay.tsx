import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../stores/userStore';
import { useHaptics } from '../../hooks/useHaptics';
import styles from './LevelUpOverlay.module.css';

interface LevelUpOverlayProps {
  onClose: () => void;
  levelTitle: string;
  currentTier: number;
  levelIndex: number;
}

const LevelUpOverlay = ({ onClose, levelTitle, currentTier, levelIndex }: LevelUpOverlayProps) => {
  const { locale } = useUserStore();
  const { t } = useTranslation();
  const haptics = useHaptics();

  useEffect(() => {
    haptics.byTier(currentTier);
  }, [currentTier, haptics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const levelKey = String(levelIndex + 1);
  const promotionText = t(`levelup.${levelKey}`, '');

  const getTierTitle = (tier: number) => {
    const titles = {
      1: { tw: '菜鳥階級', en: 'Rookie Tier' },
      2: { tw: '古銅階級', en: 'Bronze Tier' },
      3: { tw: '白銀階級', en: 'Silver Tier' },
      4: { tw: '黃金階級', en: 'Gold Tier' },
      5: { tw: '鑽石階級', en: 'Diamond Tier' },
    };
    return titles[tier as keyof typeof titles] || titles[1];
  };

  const tierInfo = getTierTitle(currentTier);

  return (
    <div className={`${styles.overlay} ${styles[`tier${currentTier}`]}`} onClick={onClose}>
      <div className={styles.content}>
        <div className={styles.alchemyCircle}>
          <div className={styles.circleInner}></div>
          <div className={styles.circleOuter}></div>
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>✨ {locale === 'TW' ? '晉升！' : 'Level Up!'} ✨</h1>
          <h2 className={styles.levelTitle}>{levelTitle}</h2>
          <p className={styles.tierLabel}>{tierInfo[locale === 'TW' ? 'tw' : 'en']}</p>
          {promotionText && <p className={styles.promotionText}>{promotionText}</p>}
        </div>
      </div>
    </div>
  );
};

export default LevelUpOverlay;
