import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getExchangeItem,
  getRandomExchangeMsg,
} from "../../utils/equivalentExchange";
import { formatCurrency } from "../../utils/i18n";
import { getFontSizeClass } from "../../utils/ui";
import { useUserStore } from "../../stores/userStore";
import { useAlchemyStore } from "../../stores/alchemyStore";
import { useHaptics } from "../../hooks/useHaptics";
import { AdService } from "../../services/adService";
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
  const { isAdRewardPending, setAdRewardPending } = useAlchemyStore();
  const [isAdLoading, setIsAdLoading] = useState(false);

  // 同步語言設定
  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  const currency = locale === "TW" ? "TWD" : "USD";
  const exchangeResult = getExchangeItem(earned, minutes, currency);
  const { item, desc } = useMemo(
    () => getRandomExchangeMsg(exchangeResult.key, isAdRewardPending),
    [exchangeResult.key, isAdRewardPending],
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

  const handleWatchAd = async () => {
    if (isAdLoading || isAdRewardPending) {
      console.warn(
        "[ReceiptCard] Ignoring duplicate watch-ad click (loading or already pending reward).",
      );
      return;
    }

    setIsAdLoading(true);
    try {
      const success = await AdService.showRewardedAd();
      if (success) {
        setAdRewardPending(true);
        await haptics.heavy(); // 成功召喚傳說，給予最強震動
      } else {
        // 廣告加載或播放失敗，給予召喚失敗提示
        alert(t("exchange.summonFailed"));
      }
    } catch (err) {
      console.error("Failed to summon legendary:", err);
      alert(t("exchange.summonFailed"));
    } finally {
      setIsAdLoading(false);
    }
  };

  const handleClose = () => {
    if (isAdRewardPending) {
      // 關閉收據時消耗掉這次的廣告傳說獎勵
      setAdRewardPending(false);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.receiptCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.receiptHeader}>
          <div className={styles.receiptTitle}>{t("receiptTitle")}</div>
          <div className={styles.receiptSubtitle}>{t("receiptSubtitle")}</div>
        </div>

        <div className={styles.receiptBody}>
          <div className={styles.exchangeIcon}>{exchangeResult.icon}</div>
          <div className={styles.itemName}>
            {isAdRewardPending && (
              <span className={styles.legendaryBadge}>LEGENDARY</span>
            )}
            {item}
          </div>
          <div className={styles.itemDesc}>{desc}</div>

          {!isAdRewardPending && (
            <button
              className={styles.adRewardButton}
              onClick={handleWatchAd}
              disabled={isAdLoading}
            >
              {isAdLoading
                ? locale === "TW"
                  ? "召喚中..."
                  : t("adLoading")
                : t("adRewardButton")}
            </button>
          )}

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
          <button className={styles.closeButton} onClick={handleClose}>
            {t("receiptConfirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
