import { useEffect } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import styles from './LevelUpOverlay.module.css';

interface LevelUpOverlayProps {
  onClose: () => void;
  levelTitle: string;
  currentTier: number;
}

const LevelUpOverlay = ({ onClose, levelTitle, currentTier }: LevelUpOverlayProps) => {

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

  const getPromotionText = (tier: number) => {
    const texts = {
      1: { tw: '你踏出了第一步...但還只是個菜鳥。', en: 'You took the first step... but still a rookie.' },
      2: { tw: '古銅之光閃耀！你已不再是無名小卒。', en: 'Bronze light shines! You are no longer a nobody.' },
      3: { tw: '白銀之力覺醒！摸魚的藝術正在精進。', en: 'Silver power awakens! The art of slacking is improving.' },
      4: { tw: '黃金燃燒！你已成為真正的煉金術師！', en: 'Gold burns! You have become a true alchemist!' },
      5: { tw: '鑽石閃電！你已達到巔峰，成為傳說中的 CTO！', en: 'Diamond lightning! You have reached the peak, becoming the legendary CTO!' },
    };
    return texts[tier as keyof typeof texts] || texts[1];
  };

  const tierInfo = getTierTitle(currentTier);
  const promotionText = getPromotionText(currentTier);

  return (
    <div className={`${styles.overlay} ${styles[`tier${currentTier}`]}`} onClick={onClose}>
      <div className={styles.content}>
        <div className={styles.alchemyCircle}>
          <div className={styles.circleInner}></div>
          <div className={styles.circleOuter}></div>
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>✨ 晉升！ ✨</h1>
          <h2 className={styles.levelTitle}>{levelTitle}</h2>
          <p className={styles.tierLabel}>{tierInfo.tw}</p>
          <p className={styles.promotionText}>{promotionText.tw}</p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpOverlay;
