import { ReactNode, useState, useEffect } from 'react';
import Header from '../Header/Header';
import AdBanner from '../AdBanner/AdBanner';
import LevelUpOverlay from '../LevelUpOverlay/LevelUpOverlay';
import { useRPGLevel } from '../../hooks/useRPGLevel';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { hasJustLeveledUp, level, currentTier, isDiamondMode } = useRPGLevel();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ title: string; tier: number; index: number } | null>(null);

  useEffect(() => {
    if (hasJustLeveledUp) {
      setLevelUpData({ title: level.title, tier: currentTier, index: level.index });
      setShowLevelUp(true);
    }
  }, [hasJustLeveledUp, level.title, level.index, currentTier]);

  const handleCloseLevelUp = () => {
    setShowLevelUp(false);
    setLevelUpData(null);
  };

  return (
    <div className={`${styles.container} ${isDiamondMode ? styles.diamondMode : ''}`}>
      <div className={`${styles.appWrapper} ${isDiamondMode ? styles.diamondMode : ''}`}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <AdBanner />
      </div>
      {showLevelUp && levelUpData && (
        <LevelUpOverlay 
          onClose={handleCloseLevelUp} 
          levelTitle={levelUpData.title}
          currentTier={levelUpData.tier}
          levelIndex={levelUpData.index}
        />
      )}
    </div>
  );
};

export default Layout;
