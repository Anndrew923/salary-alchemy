import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../stores/userStore";
import { useAlchemyStore } from "../../stores/alchemyStore";
import { useSalaryCalculator } from "../../hooks/useSalaryCalculator";
import { useAlchemyTimer } from "../../hooks/useAlchemyTimer";
import { useHaptics } from "../../hooks/useHaptics";
import { formatCurrency, formatCurrencyPerSecond } from "../../utils/i18n";
import ReceiptCard from "../ReceiptCard/ReceiptCard";
import styles from "./SalaryInput.module.css";

const SalaryInput = () => {
  const {
    monthlySalary,
    dailyHours,
    workingDays,
    locale,
    setMonthlySalary,
    setDailyHours,
    setWorkingDays,
  } = useUserStore();
  const {
    isRunning,
    start,
    reset,
    finishSession,
    resetTotalEarned,
    totalEarned,
  } = useAlchemyStore();
  const { ratePerSecond, ratePerHour, monthlyHours } = useSalaryCalculator();
  const elapsedSeconds = useAlchemyTimer();
  const haptics = useHaptics();
  const { t, i18n } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [localSalary, setLocalSalary] = useState(monthlySalary.toString());
  const [localDailyHours, setLocalDailyHours] = useState(dailyHours.toString());
  const [localWorkingDays, setLocalWorkingDays] = useState(
    workingDays.toString(),
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptEarned, setReceiptEarned] = useState(0);
  const [receiptMinutes, setReceiptMinutes] = useState(0);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [randomConfirmMessage, setRandomConfirmMessage] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const longPressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressStartTimeRef = useRef<number | null>(null);

  // 同步 react-i18next 語言
  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  // 同步本地狀態與 store
  useEffect(() => {
    setLocalSalary(monthlySalary.toString());
    setLocalDailyHours(dailyHours.toString());
    setLocalWorkingDays(workingDays.toString());
  }, [monthlySalary, dailyHours, workingDays]);

  const handleSalaryChange = (value: string) => {
    setLocalSalary(value);
    const num = Math.max(0, parseFloat(value) || 0);
    setMonthlySalary(num);
  };

  const handleDailyHoursChange = (value: string) => {
    setLocalDailyHours(value);
    const num = Math.max(0, parseFloat(value) || 0);
    setDailyHours(num);
  };

  const handleWorkingDaysChange = (value: string) => {
    setLocalWorkingDays(value);
    const num = Math.max(0, parseFloat(value) || 0);
    setWorkingDays(num);
  };

  const handleStart = async () => {
    if (monthlySalary > 0 && monthlyHours > 0) {
      await haptics.light();
      start();
      setIsExpanded(false);
    }
  };

  const handleSettle = async () => {
    const alchemyStore = useAlchemyStore.getState();
    if (alchemyStore.startTimestamp && ratePerSecond > 0) {
      const earned = alchemyStore.calculateEarned(ratePerSecond);
      if (earned > 0) {
        await haptics.medium();
        const minutes = elapsedSeconds / 60;
        setReceiptEarned(earned);
        setReceiptMinutes(minutes);
        setShowReceipt(true);
        finishSession(earned);
      } else {
        reset();
      }
    }
  };

  const handleDiscard = async () => {
    await haptics.vibrate();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await haptics.vibrate();
    reset();
  };

  // 長按處理邏輯
  const handleLongPressStart = () => {
    longPressStartTimeRef.current = Date.now();
    setLongPressProgress(0);

    // 每 50ms 更新進度
    longPressTimerRef.current = setInterval(() => {
      if (longPressStartTimeRef.current) {
        const elapsed = Date.now() - longPressStartTimeRef.current;
        const progress = Math.min((elapsed / 2000) * 100, 100);
        setLongPressProgress(progress);

        if (elapsed >= 2000) {
          // 長按 2 秒完成，顯示確認對話框
          handleLongPressComplete();
        }
      }
    }, 50);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearInterval(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressStartTimeRef.current = null;
    setLongPressProgress(0);
  };

  const handleLongPressComplete = async () => {
    await haptics.heavy();
    handleLongPressEnd();

    // 隨機選擇確認文案
    const messages = t("resetLabConfirmMessages", {
      returnObjects: true,
    }) as string[];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomConfirmMessage(messages[randomIndex]);

    setShowConfirmDialog(true);
  };

  const handleConfirmReset = async () => {
    // 執行重置（包含本地和云端同步）
    await resetTotalEarned();
    setShowConfirmDialog(false);
    setIsExpanded(false); // 重置後自動摺疊

    // 顯示成功提示
    setShowSuccessMessage(true);

    // 3 秒後自動關閉成功提示
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleCancelReset = () => {
    setShowConfirmDialog(false);
  };

  // 清理定時器
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearInterval(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* 摺疊/展開切換按鈕 */}
      {!isExpanded && (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
          disabled={isRunning}
        >
          {t("modifyParams")}
        </button>
      )}

      {/* 輸入表單區域（可摺疊） */}
      <div
        className={`${styles.formSection} ${isExpanded ? styles.expanded : styles.collapsed}`}
      >
        {isExpanded && (
          <>
            <button
              className={styles.collapseButton}
              onClick={() => setIsExpanded(false)}
              aria-label={t("resetLabCancel")}
            >
              ×
            </button>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("monthlySalary")}</label>
              <input
                type="number"
                inputMode="decimal"
                className={styles.input}
                value={localSalary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder="0"
                disabled={isRunning}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t("dailyHours")}</label>
              <input
                type="number"
                inputMode="decimal"
                className={styles.input}
                value={localDailyHours}
                onChange={(e) => handleDailyHoursChange(e.target.value)}
                placeholder="8"
                disabled={isRunning}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t("workingDays")}</label>
              <input
                type="number"
                inputMode="decimal"
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
                  <span className={styles.rateLabel}>{t("perSecond")}:</span>
                  <span className={`${styles.rateValue} monospace`}>
                    {formatCurrencyPerSecond(ratePerSecond, locale)}
                  </span>
                </div>
                <div className={styles.rateItem}>
                  <span className={styles.rateLabel}>{t("perHour")}:</span>
                  <span className={`${styles.rateValue} monospace`}>
                    {formatCurrency(ratePerHour, locale)}
                  </span>
                </div>
              </div>
            )}

            {/* 撤銷實驗室按鈕（長按 2 秒） */}
            <div className={styles.resetLabSection}>
              <button
                className={styles.resetLabButton}
                onMouseDown={handleLongPressStart}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={handleLongPressStart}
                onTouchEnd={handleLongPressEnd}
                disabled={isRunning || totalEarned <= 0}
              >
                <span className={styles.resetLabButtonText}>
                  {t("resetLab")}
                </span>
                {longPressProgress > 0 && longPressProgress < 100 && (
                  <div className={styles.longPressProgress}>
                    <div
                      className={styles.longPressProgressBar}
                      style={{ width: `${longPressProgress}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* 二次確認對話框 */}
      {showConfirmDialog && (
        <div
          className={styles.confirmDialogOverlay}
          onClick={handleCancelReset}
        >
          <div
            className={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmDialogTitle}>
              {t("resetLabConfirm")}
            </h3>
            <p className={styles.confirmDialogMessage}>
              {randomConfirmMessage || t("resetLabConfirmMessage")}
            </p>
            <div className={styles.confirmDialogButtons}>
              <button
                className={`${styles.confirmDialogButton} ${styles.confirmDialogCancel}`}
                onClick={handleCancelReset}
              >
                {t("resetLabCancel")}
              </button>
              <button
                className={`${styles.confirmDialogButton} ${styles.confirmDialogConfirm}`}
                onClick={handleConfirmReset}
              >
                {t("resetLabConfirmButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重置成功提示 */}
      {showSuccessMessage && (
        <div
          className={styles.confirmDialogOverlay}
          onClick={() => setShowSuccessMessage(false)}
        >
          <div
            className={styles.successDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.successDialogTitle}>
              ✓ {t("resetLabSuccessTitle")}
            </h3>
            <p className={styles.successDialogMessage}>
              {t("resetLabSuccess")}
            </p>
            <div className={styles.confirmDialogButtons}>
              <button
                className={styles.successDialogButton}
                onClick={() => setShowSuccessMessage(false)}
              >
                {t("receiptConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 等價交換收據卡片 */}
      {showReceipt && (
        <ReceiptCard
          earned={receiptEarned}
          minutes={receiptMinutes}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* 控制按鈕組（始終顯示） */}
      <div className={styles.buttonGroup}>
        {!isRunning ? (
          <button
            className={`${styles.button} ${styles.startButton}`}
            onClick={handleStart}
            disabled={monthlySalary <= 0 || monthlyHours <= 0}
          >
            {t("start")}
          </button>
        ) : (
          <>
            <button
              className={`${styles.button} ${styles.settleButton}`}
              onClick={handleSettle}
            >
              {t("finish")}
            </button>
            <button
              className={`${styles.button} ${styles.discardButton}`}
              onClick={handleDiscard}
            >
              {t("giveUp")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SalaryInput;
