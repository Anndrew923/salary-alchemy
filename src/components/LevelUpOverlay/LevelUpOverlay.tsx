import { useEffect, useMemo } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useUserStore } from '../../stores/userStore';
import zhTW from '../../locales/zh-TW.json';
import enUS from '../../locales/en-US.json';
import styles from './LevelUpOverlay.module.css';

interface LevelUpOverlayProps {
  onClose: () => void;
  levelTitle: string;
  currentTier: number;
  levelIndex: number;
}

const LevelUpOverlay = ({ onClose, levelTitle, currentTier, levelIndex }: LevelUpOverlayProps) => {
  const { locale } = useUserStore();

  useEffect(() => {
    // 觸發震動回饋
    const triggerHaptic = async () => {
      try {
        if (currentTier >= 5) {
          // Tier 5 使用重震動
          await Haptics.impact({ style: ImpactStyle.Heavy });
          await new Promise(resolve => setTimeout(resolve, 200));
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } else if (currentTier >= 3) {
          // Tier 3-4 使用中等震動
          await Haptics.impact({ style: ImpactStyle.Medium });
        } else {
          // Tier 1-2 使用輕震動
          await Haptics.impact({ style: ImpactStyle.Light });
        }
      } catch (error) {
        // 如果 haptics 不可用（例如在 Web 環境），忽略錯誤
        console.log('Haptics not available:', error);
      }
    };

    triggerHaptic();
  }, [currentTier]);

  // 3 秒後自動關閉
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // 從翻譯檔讀取毒舌文案
  const promotionText = useMemo(() => {
    const translations = locale === 'TW' ? zhTW : enUS;
    const levelKey = String(levelIndex + 1); // levelIndex 是 0-based，翻譯檔是 1-based
    return translations.levelup?.[levelKey as keyof typeof translations.levelup] || '';
  }, [locale, levelIndex]);

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
          <p className={styles.promotionText}>{promotionText}</p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpOverlay;
