import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../stores/userStore";
import { useHaptics } from "../../hooks/useHaptics";
import styles from "./LevelUpOverlay.module.css";

interface LevelUpOverlayProps {
  onClose: () => void;
  levelTitle: string;
  currentTier: number;
  levelIndex: number;
}

const LevelUpOverlay = ({
  onClose,
  levelTitle,
  currentTier,
  levelIndex,
}: LevelUpOverlayProps) => {
  const { locale } = useUserStore();
  const { t, i18n } = useTranslation();
  const haptics = useHaptics();

  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  useEffect(() => {
    haptics.byTier(currentTier);
  }, [currentTier, haptics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const levelKey = String(levelIndex + 1);
  const promotionText = t(`levelup.${levelKey}`, "");

  // 判斷是否為 40 級以上（跨星系特效）
  const isGalacticLevel = levelIndex >= 40;

  const tierLabel = t(`header.tier${currentTier}`, { defaultValue: "" }) || t("header.tier1");

  return (
    <div
      className={`${styles.overlay} ${styles[`tier${currentTier}`]} ${isGalacticLevel ? styles.galactic : ""}`}
      onClick={onClose}
    >
      <div className={styles.content}>
        <div className={styles.alchemyCircle}>
          <div className={styles.circleInner}></div>
          <div className={styles.circleOuter}></div>
          {isGalacticLevel && (
            <>
              <div className={styles.galacticParticles}></div>
              <div className={styles.galacticNebula}></div>
            </>
          )}
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            ✨ {t("levelUpTitle")} ✨
          </h1>
          <h2 className={styles.levelTitle}>{levelTitle}</h2>
          <p className={styles.tierLabel}>
            {tierLabel}
          </p>
          {promotionText && (
            <p className={styles.promotionText}>{promotionText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelUpOverlay;
