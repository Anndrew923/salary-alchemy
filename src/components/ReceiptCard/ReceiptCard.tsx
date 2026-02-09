import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getExchangeItem,
  getRandomExchangeMsg,
  getIconForCategoryKey,
  type ExchangeMsgResult,
} from "../../utils/equivalentExchange";
import { LUCKY_DROP_CHANCE } from "../../utils/constants";
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

const HIGH_TIER_KEYS = ["wealth_legendary", "wealth_overlord"] as const;

const ReceiptCard = ({ earned, minutes, onClose }: ReceiptCardProps) => {
  const { locale, collectItem } = useUserStore();
  const { t, i18n } = useTranslation();
  const haptics = useHaptics();
  const { isAdRewardPending, setAdRewardPending } = useAlchemyStore();
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [msgResult, setMsgResult] = useState<ExchangeMsgResult | null>(null);

  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  const currency = locale === "TW" ? "TWD" : "USD";
  const exchangeResult = getExchangeItem(earned, minutes, currency);

  // 幸運越級 + 廣告必定未擁有：只跑一次，決定本張收據的物品（不依賴 unlockedItems 以免重開收據時重抽）
  useEffect(() => {
    const effectiveKey =
      !isAdRewardPending && Math.random() < LUCKY_DROP_CHANCE
        ? HIGH_TIER_KEYS[Math.floor(Math.random() * HIGH_TIER_KEYS.length)]
        : exchangeResult.key;
    const unlockedItems = useUserStore.getState().unlockedItems;
    const excludeIds = isAdRewardPending
      ? new Set(
          Object.keys(unlockedItems).filter((id) =>
            id.startsWith("ad_legendary_"),
          ),
        )
      : undefined;
    setMsgResult(
      getRandomExchangeMsg(effectiveKey, isAdRewardPending, { excludeIds }),
    );
  }, [exchangeResult.key, isAdRewardPending]);

  const { item, desc } = msgResult ?? {
    item: "...",
    desc: "",
    itemId: "",
  };

  const effectiveKey = msgResult
    ? msgResult.itemId.replace(/_\d+$/, "")
    : exchangeResult.key;

  useEffect(() => {
    const triggerHaptics = async () => {
      if (effectiveKey === "wealth_overlord") {
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 200));
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await haptics.heavy();
      } else if (effectiveKey === "wealth_legendary" || effectiveKey === "ad_legendary") {
        await haptics.heavy();
        await new Promise((resolve) => setTimeout(resolve, 150));
        await haptics.medium();
      } else if (
        effectiveKey === "wealth_ultra" ||
        effectiveKey === "wealth_high"
      ) {
        await haptics.medium();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await haptics.light();
      } else if (
        effectiveKey === "wealth_mid" ||
        effectiveKey === "wealth_mid_low"
      ) {
        await haptics.medium();
      } else if (effectiveKey === "health_critical" || effectiveKey === "health_warning") {
        await haptics.medium();
      } else {
        await haptics.light();
      }
    };
    triggerHaptics();
  }, [effectiveKey, haptics]);

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
    if (msgResult?.itemId) collectItem(msgResult.itemId);
    if (isAdRewardPending) setAdRewardPending(false);
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
          <div className={styles.exchangeIcon}>
            {msgResult ? getIconForCategoryKey(msgResult.itemId) : exchangeResult.icon}
          </div>
          <div className={styles.itemName}>
            {isAdRewardPending && (
              <span className={styles.legendaryBadge}>{t("receiptLegendaryBadge")}</span>
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
              {isAdLoading ? t("adLoading") : t("adRewardButton")}
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
                {Math.floor(minutes)} {t("receiptTimeUnit")}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t("receiptType")}</span>
              <span className={styles.detailValue}>
                {effectiveKey === "health_critical" || effectiveKey === "health_warning"
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
