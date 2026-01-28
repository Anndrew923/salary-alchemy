import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  getExchangeItem,
  getRandomExchangeMsg,
} from "../../utils/equivalentExchange";
import { formatCurrency } from "../../utils/i18n";
import { getFontSizeClass } from "../../utils/ui";
import { useUserStore } from "../../stores/userStore";
import { useHaptics } from "../../hooks/useHaptics";
import styles from "./ReceiptCard.module.css";

interface ReceiptCardProps {
  earned: number;
  minutes: number;
  onClose: () => void;
}

const ReceiptCard = ({ earned, minutes, onClose }: ReceiptCardProps) => {
  const { locale } = useUserStore();
  const { t, i18n } = useTranslation();
  const haptics = useHaptics();

  // 同步語言設定
  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  const currency = locale === "TW" ? "TWD" : "USD";
  const exchangeResult = getExchangeItem(earned, minutes, currency);
  const { item, desc } = useMemo(
    () => getRandomExchangeMsg(exchangeResult.key),
    [exchangeResult.key],
  );

  // 根據 exchangeResult 的級距決定觸覺回饋強度
  useEffect(() => {
    const triggerHaptics = async () => {
      if (exchangeResult.key === "wealth_overlord") {
        // wealth_overlord 必須有最震撼的振動效果
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 200));
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await haptics.heavy();
      } else if (exchangeResult.key === "wealth_legendary") {
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 150));
        await haptics.medium();
      } else if (
        exchangeResult.key === "wealth_ultra" ||
        exchangeResult.key === "wealth_high"
      ) {
        await haptics.medium();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await haptics.light();
      } else if (
        exchangeResult.key === "wealth_mid" ||
        exchangeResult.key === "wealth_mid_low"
      ) {
        await haptics.medium();
      } else if (exchangeResult.type === "HEALTH") {
        // 健康警告也需要較強的回饋
        await haptics.medium();
      } else {
        await haptics.light();
      }
    };

    triggerHaptics();
  }, [exchangeResult.key, exchangeResult.type, haptics]);

  // 格式化金額字串，用於動態字體縮放
  const earnedFormatted = formatCurrency(earned, locale);
  const fontSizeClass = getFontSizeClass(earnedFormatted);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.receiptCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.receiptHeader}>
          <div className={styles.receiptTitle}>{t("receiptTitle")}</div>
          <div className={styles.receiptSubtitle}>{t("receiptSubtitle")}</div>
        </div>

        <div className={styles.receiptBody}>
          <div className={styles.exchangeIcon}>{exchangeResult.icon}</div>
          <div className={styles.itemName}>{item}</div>
          <div className={styles.itemDesc}>{desc}</div>

          <div className={styles.receiptDivider} />

          <div className={styles.receiptDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t("receiptAmount")}</span>
              <span
                className={`${styles.detailValue} ${styles[fontSizeClass]} monospace`}
              >
                {earnedFormatted}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t("receiptTime")}</span>
              <span className={`${styles.detailValue} monospace`}>
                {Math.floor(minutes)} {locale === "TW" ? "分鐘" : "min"}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t("receiptType")}</span>
              <span className={styles.detailValue}>
                {exchangeResult.type === "HEALTH"
                  ? t("receiptTypeHealth")
                  : t("receiptTypeWealth")}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.receiptFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            {t("receiptConfirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
