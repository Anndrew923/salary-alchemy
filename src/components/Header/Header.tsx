import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRPGLevel } from "../../hooks/useRPGLevel";
import { useUserStore } from "../../stores/userStore";
import { useAlchemyStore } from "../../stores/alchemyStore";
import { formatCurrency } from "../../utils/i18n";
import styles from "./Header.module.css";

const Header = () => {
  const { level, isDiamondMode, nextLevelThreshold, currentTier } =
    useRPGLevel();
  const {
    locale,
    hasSeenPrivacyNotice,
    setLocale,
    setPrivacyModalOpen,
    setShouldNavigateToLeaderboard,
  } = useUserStore();
  const { totalEarned } = useAlchemyStore();
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === "TW" ? "EN" : "TW");
  };

  const tooltipText = nextLevelThreshold
    ? `${t("header.nextLevel")} ${formatCurrency(totalEarned, locale)} / ${formatCurrency(nextLevelThreshold, locale)}`
    : t("header.maxLevelReached");

  const navigateToLeaderboard = () => {
    // 如果 hasSeenPrivacyNotice 為 false，則調用 setPrivacyModalOpen(true) 彈出協議，暫緩導航
    if (!hasSeenPrivacyNotice) {
      setShouldNavigateToLeaderboard(true); // 標記簽署後應該導向排行榜
      setPrivacyModalOpen(true);
      return;
    }
    // 已簽署，直接導航
    window.location.hash = "#leaderboard";
  };

  return (
    <header
      className={`${styles.header} ${isDiamondMode ? styles.diamondMode : ""}`}
    >
      <div className={styles.topNav}>
        <button
          className={styles.leaderboardButton}
          onClick={navigateToLeaderboard}
          aria-label={t("header.goLeaderboard")}
        >
          🏆 {t("leaderboard")}
        </button>
        <button
          className={styles.localeButton}
          onClick={toggleLocale}
          aria-label={t("header.toggleLanguage")}
        >
          {locale}
        </button>
      </div>
      <h1 className={styles.title}>{t("appName")}</h1>
      <div className={styles.level}>
        <span
          className={`${styles.levelLabel} ${styles[`tier${currentTier}`]}`}
          onClick={() => setShowTooltip(!showTooltip)}
          style={{ cursor: "pointer" }}
        >
          {level.title}
        </span>
        {showTooltip && <div className={styles.tooltip}>{tooltipText}</div>}
      </div>
    </header>
  );
};

export default Header;
