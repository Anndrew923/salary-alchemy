import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAlchemyStore } from "../../stores/alchemyStore";
import { useSalaryCalculator } from "../../hooks/useSalaryCalculator";
import { useAlchemyTimer } from "../../hooks/useAlchemyTimer";
import { useUserStore } from "../../stores/userStore";
import {
  formatCurrencyParts,
  formatCurrency,
  formatCurrencyPerSecond,
  formatTime,
} from "../../utils/i18n";
import { getFontSizeClass } from "../../utils/ui";
import styles from "./AlchemyDisplay.module.css";

const AlchemyDisplay = () => {
  const { ratePerSecond } = useSalaryCalculator();
  const { isRunning, calculateEarned, totalEarned } = useAlchemyStore();
  const { locale } = useUserStore();
  const { t, i18n } = useTranslation();
  const elapsedSeconds = useAlchemyTimer();

  // 同步 react-i18next 語言
  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  // 計算當前收益（僅在運行時顯示）
  const currentEarned = isRunning ? calculateEarned(ratePerSecond) : 0;

  // 格式化金額字串，用於動態字體縮放
  const currentEarnedFormatted = formatCurrency(currentEarned, locale);
  const totalEarnedFormatted = formatCurrency(totalEarned, locale);
  const { symbol: currentSymbol, value: currentValue } = formatCurrencyParts(
    currentEarned,
    locale,
  );
  const { symbol: totalSymbol, value: totalValue } = formatCurrencyParts(
    totalEarned,
    locale,
  );

  return (
    <div className={styles.container}>
      <div className={styles.currentSection}>
        <div className={styles.label}>{t("currentEarned")}</div>
        <div
          className={`${styles.amount} ${styles[getFontSizeClass(currentEarnedFormatted)]}`}
        >
          <span className={styles.currencySymbol}>{currentSymbol}</span>
          <span className="monospace">{currentValue}</span>
        </div>
        <div className={styles.rate}>
          {formatCurrencyPerSecond(ratePerSecond, locale)} {t("perSecond")}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalSection}>
        <div className={styles.label}>{t("totalEarned")}</div>
        <div
          className={`${styles.amount} ${styles.totalAmount} ${styles[getFontSizeClass(totalEarnedFormatted)]}`}
        >
          <span className={styles.currencySymbol}>{totalSymbol}</span>
          <span className="monospace">{totalValue}</span>
        </div>
      </div>

      {isRunning && (
        <div className={styles.timeDisplay}>
          <div className={styles.timeLabel}>{t("runningTime")}</div>
          <div className={`${styles.time} monospace`}>
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlchemyDisplay;
