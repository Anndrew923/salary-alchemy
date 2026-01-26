import { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { useSalaryCalculator } from '../../hooks/useSalaryCalculator';
import { getI18n, formatCurrency } from '../../utils/i18n';
import styles from './SalaryInput.module.css';

const SalaryInput = () => {
  const { monthlySalary, dailyHours, workingDays, locale, setMonthlySalary, setDailyHours, setWorkingDays } = useUserStore();
  const { isRunning, start, pause, reset } = useAlchemyStore();
  const { ratePerSecond, ratePerHour, monthlyHours } = useSalaryCalculator();
  const i18n = getI18n(locale);

  const [isExpanded, setIsExpanded] = useState(false);
  const [localSalary, setLocalSalary] = useState(monthlySalary.toString());
  const [localDailyHours, setLocalDailyHours] = useState(dailyHours.toString());
  const [localWorkingDays, setLocalWorkingDays] = useState(workingDays.toString());

  // 同步本地狀態與 store
  useEffect(() => {
    setLocalSalary(monthlySalary.toString());
    setLocalDailyHours(dailyHours.toString());
    setLocalWorkingDays(workingDays.toString());
  }, [monthlySalary, dailyHours, workingDays]);

  const handleSalaryChange = (value: string) => {
    setLocalSalary(value);
    const num = parseFloat(value) || 0;
    setMonthlySalary(num);
  };

  const handleDailyHoursChange = (value: string) => {
    setLocalDailyHours(value);
    const num = parseFloat(value) || 0;
    setDailyHours(num);
  };

  const handleWorkingDaysChange = (value: string) => {
    setLocalWorkingDays(value);
    const num = parseFloat(value) || 0;
    setWorkingDays(num);
  };

  const handleStart = () => {
    if (monthlySalary > 0 && monthlyHours > 0) {
      start();
      setIsExpanded(false); // 開始後自動摺疊
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
      {/* 摺疊/展開切換按鈕 */}
      {!isExpanded && (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
          disabled={isRunning}
        >
          {i18n.modifyParams}
        </button>
      )}

      {/* 輸入表單區域（可摺疊） */}
      <div className={`${styles.formSection} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        {isExpanded && (
          <>
            <button
              className={styles.collapseButton}
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse"
            >
              ×
            </button>
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

            <div className={styles.formGroup}>
              <label className={styles.label}>{i18n.workingDays}</label>
              <input
                type="number"
                className={styles.input}
                value={localWorkingDays}
                onChange={(e) => handleWorkingDaysChange(e.target.value)}
                placeholder="20"
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
          </>
        )}
      </div>

      {/* 控制按鈕組（始終顯示） */}
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
