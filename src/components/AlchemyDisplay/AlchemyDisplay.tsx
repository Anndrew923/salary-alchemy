import { useAlchemyStore } from '../../stores/alchemyStore';
import { useSalaryCalculator } from '../../hooks/useSalaryCalculator';
import { useAlchemyTimer } from '../../hooks/useAlchemyTimer';
import { useUserStore } from '../../stores/userStore';
import { formatCurrency, formatTime, getI18n } from '../../utils/i18n';
import styles from './AlchemyDisplay.module.css';

const AlchemyDisplay = () => {
  const { ratePerSecond } = useSalaryCalculator();
  const { isRunning, calculateEarned, totalEarned } = useAlchemyStore();
  const { locale } = useUserStore();
  const i18n = getI18n(locale);
  const elapsedSeconds = useAlchemyTimer();

  // 計算當前收益（僅在運行時顯示）
  const currentEarned = isRunning ? calculateEarned(ratePerSecond) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.currentSection}>
        <div className={styles.label}>{i18n.currentEarned}</div>
        <div className={`${styles.amount} monospace`}>
          {formatCurrency(currentEarned, locale)}
        </div>
        <div className={styles.rate}>
          {formatCurrency(ratePerSecond, locale)} {i18n.perSecond}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalSection}>
        <div className={styles.label}>{i18n.totalEarned}</div>
        <div className={`${styles.amount} ${styles.totalAmount} monospace`}>
          {formatCurrency(totalEarned, locale)}
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
