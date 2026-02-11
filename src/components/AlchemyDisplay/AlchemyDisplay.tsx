import { useEffect, useMemo, useState } from "react";
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
import { getCollectionStats } from "../../utils/equivalentExchange";
import ReceiptCard from "../ReceiptCard/ReceiptCard";
import styles from "./AlchemyDisplay.module.css";

const AlchemyDisplay = () => {
  const { ratePerSecond, ratePerHour } = useSalaryCalculator();
  const { isRunning, calculateEarned, totalEarned, start, finishSession, reset } =
    useAlchemyStore();
  const { locale, unlockedItems, monthlySalary, dailyHours, workingDays } =
    useUserStore();
  const { t, i18n } = useTranslation();
  const elapsedSeconds = useAlchemyTimer();

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptEarned, setReceiptEarned] = useState(0);
  const [receiptMinutes, setReceiptMinutes] = useState(0);

  const stats = useMemo(() => getCollectionStats(), []);
  const collectionCount = useMemo(
    () => Object.keys(unlockedItems).length,
    [unlockedItems],
  );
  const collectionTotal = stats.total;

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

  const handleMainAction = async () => {
    if (!isRunning) {
      if (ratePerSecond > 0) {
        start();
      }
      return;
    }

    const earned = calculateEarned(ratePerSecond);
    if (earned > 0) {
      setReceiptEarned(earned);
      setReceiptMinutes(elapsedSeconds / 60);
      setShowReceipt(true);
      await finishSession(earned);
    } else {
      reset();
    }
  };

  const handleModifyParams = () => {
    const target = document.getElementById("salary-input-panel");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.container}>
      {/* DisplayContainer：數字跳動主顯示區 */}
      <section className={styles.displayContainer}>
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
      </section>

      {/* ParameterStatus：結合資訊顯示與修改入口，平衡初次使用與日常頻率的視覺干擾 */}
      <section className={styles.parameterStatus}>
        <div className={styles.parameterRows}>
          <div className={styles.parameterRow}>
            <span className={styles.parameterLabel}>{t("monthlySalary")}</span>
            <span className={`${styles.parameterValue} monospace`}>
              {formatCurrency(monthlySalary, locale)}
            </span>
          </div>
          <div className={styles.parameterRow}>
            <span className={styles.parameterLabel}>
              {t("dailyHours")} × {t("workingDays")}
            </span>
            <span className={`${styles.parameterValue} monospace`}>
              {dailyHours || 0} × {workingDays || 0}
            </span>
          </div>
          {ratePerHour > 0 && (
            <div className={styles.parameterRow}>
              <span className={styles.parameterLabel}>{t("perHour")}</span>
              <span className={`${styles.parameterValue} monospace`}>
                {formatCurrency(ratePerHour, locale)}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.parameterModifyButton}
          onClick={handleModifyParams}
          aria-label={t("modifyParams")}
        >
          {t("modifyParams")}
        </button>
      </section>

      {/* MainActionButton：強調開始／結束鍊金的主行動按鈕 */}
      <section className={styles.mainActionSection}>
        <button
          type="button"
          className={`${styles.mainActionButton} ${isRunning ? styles.mainActionButtonStop : styles.mainActionButtonStart}`}
          onClick={handleMainAction}
          disabled={ratePerSecond <= 0}
          aria-label={isRunning ? t("finish") : t("start")}
        >
          {isRunning ? t("finish") : t("start")}
        </button>
      </section>

      <div className={styles.collectionEntry}>
        <button
          type="button"
          className={styles.collectionButton}
          onClick={() => { window.location.hash = "#/collection"; }}
          aria-label={t("collection.progress", { count: collectionCount, total: collectionTotal })}
        >
          📜 {t("collectionButton", { count: collectionCount, total: collectionTotal })}
        </button>
      </div>

      {showReceipt && (
        <ReceiptCard
          earned={receiptEarned}
          minutes={receiptMinutes}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default AlchemyDisplay;
