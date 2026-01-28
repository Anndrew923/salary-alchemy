import { useAlchemyStore } from "../../stores/alchemyStore";
import { useSalaryCalculator } from "../../hooks/useSalaryCalculator";
import { useAlchemyTimer } from "../../hooks/useAlchemyTimer";
import { useUserStore } from "../../stores/userStore";
import {
  formatCurrency,
  formatCurrencyPerSecond,
  formatTime,
  getI18n,
} from "../../utils/i18n";
import { getFontSizeClass } from "../../utils/ui";
import styles from "./AlchemyDisplay.module.css";

const AlchemyDisplay = () => {
  const { ratePerSecond } = useSalaryCalculator();
  const { isRunning, calculateEarned, totalEarned } = useAlchemyStore();
  const { locale } = useUserStore();
  const i18n = getI18n(locale);
  const elapsedSeconds = useAlchemyTimer();

  // 計算當前收益（僅在運行時顯示）
  const currentEarned = isRunning ? calculateEarned(ratePerSecond) : 0;

  // 格式化金額字串，用於動態字體縮放
  const currentEarnedFormatted = formatCurrency(currentEarned, locale);
  const totalEarnedFormatted = formatCurrency(totalEarned, locale);

  return (
    <div className={styles.container}>
      <div className={styles.currentSection}>
        <div className={styles.label}>{i18n.currentEarned}</div>
        <div
          className={`${styles.amount} ${styles[getFontSizeClass(currentEarnedFormatted)]} monospace`}
        >
          {currentEarnedFormatted}
        </div>
        <div className={styles.rate}>
          {formatCurrencyPerSecond(ratePerSecond, locale)} {i18n.perSecond}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalSection}>
        <div className={styles.label}>{i18n.totalEarned}</div>
        <div
          className={`${styles.amount} ${styles.totalAmount} ${styles[getFontSizeClass(totalEarnedFormatted)]} monospace`}
        >
          {totalEarnedFormatted}
        </div>
      </div>

      {isRunning && (
        <div className={styles.timeDisplay}>
          <div className={styles.timeLabel}>{i18n.runningTime}</div>
          <div className={`${styles.time} monospace`}>
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlchemyDisplay;
