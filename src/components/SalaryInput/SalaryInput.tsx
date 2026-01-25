import { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { useSalaryCalculator } from '../../hooks/useSalaryCalculator';
import { getI18n, formatCurrency } from '../../utils/i18n';
import styles from './SalaryInput.module.css';

const SalaryInput = () => {
  const { monthlySalary, monthlyHours, dailyHours, locale, setMonthlySalary, setMonthlyHours, setDailyHours } = useUserStore();
  const { isRunning, start, pause, reset } = useAlchemyStore();
  const { ratePerSecond, ratePerHour } = useSalaryCalculator();
  const i18n = getI18n(locale);

  const [localSalary, setLocalSalary] = useState(monthlySalary.toString());
  const [localMonthlyHours, setLocalMonthlyHours] = useState(monthlyHours.toString());
  const [localDailyHours, setLocalDailyHours] = useState(dailyHours.toString());

  const handleSalaryChange = (value: string) => {
    setLocalSalary(value);
    const num = parseFloat(value) || 0;
    setMonthlySalary(num);
  };

  const handleMonthlyHoursChange = (value: string) => {
    setLocalMonthlyHours(value);
    const num = parseFloat(value) || 0;
    setMonthlyHours(num);
  };

  const handleDailyHoursChange = (value: string) => {
    setLocalDailyHours(value);
    const num = parseFloat(value) || 0;
    setDailyHours(num);
  };

  const handleStart = () => {
    if (monthlySalary > 0 && monthlyHours > 0) {
      start();
    }
  };

  const handlePause = () => {
    const alchemyStore = useAlchemyStore.getState();
    if (alchemyStore.startTimestamp && ratePerSecond > 0) {
      const earned = alchemyStore.calculateEarned(ratePerSecond);
      if (earned > 0) {
        alchemyStore.addToTotal(earned);
      }
    }
    pause();
  };

  const handleReset = () => {
    // 重置前，先將當前收益加入總額（如果正在運行）
    if (isRunning) {
      const alchemyStore = useAlchemyStore.getState();
      if (alchemyStore.startTimestamp && ratePerSecond > 0) {
        const earned = alchemyStore.calculateEarned(ratePerSecond);
        if (earned > 0) {
          alchemyStore.addToTotal(earned);
        }
      }
    }
    reset();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <label className={styles.label}>{i18n.monthlySalary}</label>
        <input
          type="number"
          className={styles.input}
          value={localSalary}
          onChange={(e) => handleSalaryChange(e.target.value)}
          placeholder="0"
          disabled={isRunning}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>{i18n.monthlyHours}</label>
        <input
          type="number"
          className={styles.input}
          value={localMonthlyHours}
          onChange={(e) => handleMonthlyHoursChange(e.target.value)}
          placeholder="160"
          disabled={isRunning}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>{i18n.dailyHours}</label>
        <input
          type="number"
          className={styles.input}
          value={localDailyHours}
          onChange={(e) => handleDailyHoursChange(e.target.value)}
          placeholder="8"
          disabled={isRunning}
        />
      </div>

      {ratePerSecond > 0 && (
        <div className={styles.rateDisplay}>
          <div className={styles.rateItem}>
            <span className={styles.rateLabel}>{i18n.perSecond}:</span>
            <span className={`${styles.rateValue} monospace`}>
              {formatCurrency(ratePerSecond, locale)}
            </span>
          </div>
          <div className={styles.rateItem}>
            <span className={styles.rateLabel}>{i18n.perHour}:</span>
            <span className={`${styles.rateValue} monospace`}>
              {formatCurrency(ratePerHour, locale)}
            </span>
          </div>
        </div>
      )}

      <div className={styles.buttonGroup}>
        {!isRunning ? (
          <button
            className={`${styles.button} ${styles.startButton}`}
            onClick={handleStart}
            disabled={monthlySalary <= 0 || monthlyHours <= 0}
          >
            {i18n.start}
          </button>
        ) : (
          <>
            <button
              className={`${styles.button} ${styles.pauseButton}`}
              onClick={handlePause}
            >
              {i18n.pause}
            </button>
            <button
              className={`${styles.button} ${styles.resetButton}`}
              onClick={handleReset}
            >
              {i18n.reset}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SalaryInput;
