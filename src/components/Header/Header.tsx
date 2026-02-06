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
  const hasSeenPrivacyNotice = useUserStore(
    (state) => state.hasSeenPrivacyNotice,
  );
  const locale = useUserStore((state) => state.locale);
  const setPrivacyModalOpen = useUserStore(
    (state) => state.setPrivacyModalOpen,
  );
  const setShouldNavigateToLeaderboard = useUserStore(
    (state) => state.setShouldNavigateToLeaderboard,
  );
  const totalEarned = useAlchemyStore((state) => state.totalEarned);
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipText = nextLevelThreshold
    ? `${t("header.nextLevel")} ${formatCurrency(totalEarned, locale)} / ${formatCurrency(nextLevelThreshold, locale)}`
    : t("header.maxLevelReached");

  const navigateToLeaderboard = () => {
    if (!hasSeenPrivacyNotice) {
      setShouldNavigateToLeaderboard(true);
      setPrivacyModalOpen(true);
      return;
    }
    window.location.hash = "#/leaderboard";
  };

  return (
    <header
      className={`${styles.header} ${isDiamondMode ? styles.diamondMode : ""}`}
    >
      <div className={styles.topNav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => { window.location.hash = "#/"; }}
          aria-label={t("home")}
        >
          🏠 {t("home")}
        </button>
        <button
          className={styles.navButton}
          onClick={navigateToLeaderboard}
          aria-label={t("header.goLeaderboard")}
        >
          🏆 {t("leaderboard")}
        </button>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => { window.location.hash = "#/settings"; }}
          aria-label={t("settings")}
        >
          ⚙️ {t("settings")}
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
