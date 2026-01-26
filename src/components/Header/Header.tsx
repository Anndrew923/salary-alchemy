import { useState } from 'react';
import { useRPGLevel } from '../../hooks/useRPGLevel';
import { useUserStore } from '../../stores/userStore';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { getI18n } from '../../utils/i18n';
import styles from './Header.module.css';

const Header = () => {
  const { level, isDiamondMode, nextLevelThreshold, currentTier } = useRPGLevel();
  const { locale, setLocale } = useUserStore();
  const { totalEarned } = useAlchemyStore();
  const i18n = getI18n(locale);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'TW' ? 'EN' : 'TW');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tooltipText = nextLevelThreshold
    ? `Next: ${formatCurrency(totalEarned)} / ${formatCurrency(nextLevelThreshold)}`
    : 'Max Level Reached';

  return (
    <header className={`${styles.header} ${isDiamondMode ? styles.diamondMode : ''}`}>
      <div className={styles.title}>{i18n.appName}</div>
      <div className={styles.level}>
        <span 
          className={`${styles.levelLabel} ${styles[`tier${currentTier}`]}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          style={{ cursor: 'pointer' }}
        >
          {level.title}
        </span>
        {showTooltip && (
          <div className={styles.tooltip}>
            {tooltipText}
          </div>
        )}
      </div>
      <button 
        className={styles.localeButton}
        onClick={toggleLocale}
        aria-label="Toggle language"
      >
        {locale}
      </button>
    </header>
  );
};

export default Header;
