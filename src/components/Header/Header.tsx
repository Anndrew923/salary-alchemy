import { useRPGLevel } from '../../hooks/useRPGLevel';
import { useUserStore } from '../../stores/userStore';
import { getI18n } from '../../utils/i18n';
import styles from './Header.module.css';

const Header = () => {
  const { level, isDiamondMode } = useRPGLevel();
  const { locale, setLocale } = useUserStore();
  const i18n = getI18n(locale);

  const toggleLocale = () => {
    setLocale(locale === 'TW' ? 'EN' : 'TW');
  };

  return (
    <header className={`${styles.header} ${isDiamondMode ? styles.diamondMode : ''}`}>
      <div className={styles.title}>{i18n.appName}</div>
      <div className={styles.level}>
        <span className={styles.levelLabel}>{level.title}</span>
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
