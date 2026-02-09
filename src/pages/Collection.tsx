import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../stores/userStore";
import {
  getCollectionStats,
  getIconForCategoryKey,
  getItemByItemId,
} from "../utils/equivalentExchange";
import styles from "./Collection.module.css";

const Collection = () => {
  const { t } = useTranslation();
  const locale = useUserStore((s) => s.locale);
  const unlockedItems = useUserStore((s) => s.unlockedItems);
  const [detailItemId, setDetailItemId] = useState<string | null>(null);

  const stats = useMemo(() => getCollectionStats(), []);
  const count = useMemo(
    () => Object.keys(unlockedItems).length,
    [unlockedItems],
  );
  const total = stats.total;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  const detailInfo = useMemo(
    () => (detailItemId ? getItemByItemId(detailItemId, locale) : null),
    [detailItemId, locale],
  );

  const closeDetail = useCallback(() => setDetailItemId(null), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    if (detailItemId) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [detailItemId, closeDetail]);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>📜 {t("collection.title")}</h2>

      <div className={styles.progressBarWrap}>
        <div className={styles.progressText}>
          <span>
            {t("collection.progress", { count, total })}
          </span>
          <span className={styles.progressPercent}>
            {t("collection.percentage", { percent })}
          </span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.barFill}
            style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {stats.categoryOrder.map((key) => {
        const size = stats.byCategory[key];
        if (size == null || size === 0) return null;
        const categoryLabelKey = `collection.category_${key}`;
        return (
          <section key={key} className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {t(categoryLabelKey)}
            </h3>
            <div className={styles.grid}>
              {Array.from({ length: size }, (_, i) => {
                const itemId = `${key}_${i}`;
                const unlocked = !!unlockedItems[itemId];
                const info = getItemByItemId(itemId, locale);
                const label = info?.item ?? "?";
                const icon = getIconForCategoryKey(itemId);
                return (
                  <button
                    key={itemId}
                    type="button"
                    className={`${styles.card} ${unlocked ? styles.cardUnlocked : styles.cardLocked}`}
                    onClick={() => unlocked && setDetailItemId(itemId)}
                  >
                    <span className={styles.cardIcon}>
                      {unlocked ? icon : "?"}
                    </span>
                    <span className={styles.cardName}>
                      {unlocked ? label : t("collection.locked")}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {detailItemId && detailInfo && (
        <div
          className={styles.modalOverlay}
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
          aria-label={detailInfo.item}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                {t("collection.receiptTitle")}
              </div>
              <div className={styles.modalSubtitle}>
                {t("collection.receiptSubtitle")}
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon}>
                {getIconForCategoryKey(detailItemId)}
              </div>
              <div className={styles.modalItemName}>{detailInfo.item}</div>
              <div className={styles.modalDesc}>{detailInfo.desc}</div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeDetail}
              >
                {t("collection.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
