import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { signInAnonymously } from "firebase/auth";
import { auth, isFirebaseEnabled } from "../../config/firebase";
import { useUserStore } from "../../stores/userStore";
import { useAlchemyStore } from "../../stores/alchemyStore";
import { getTierIcon, getTierColor, LEVEL_TITLES } from "../../utils/constants";
import { formatCurrency } from "../../utils/i18n";
import {
  truncateByWeight,
  truncateByWeightWithoutEllipsis,
  formatWeightDisplay,
  MAX_WEIGHT,
} from "../../utils/characterLimit";
import { calculateLevel } from "../../hooks/useRPGLevel";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useHaptics } from "../../hooks/useHaptics";
import styles from "./Leaderboard.module.css";

const Leaderboard = () => {
  const {
    locale,
    uid: currentUid,
    hasSeenPrivacyNotice,
    setUid,
    setAnonymousId,
    setPrivacyModalOpen,
    setShouldNavigateToLeaderboard,
    nickname,
    setNickname,
  } = useUserStore();
  const { totalEarned: currentTotalEarned, syncToCloud } = useAlchemyStore();
  const { t, i18n } = useTranslation();
  const haptics = useHaptics();
  const { entries, loading, error, totalCount, fetchMore, hasMore } =
    useLeaderboard({
      hasSeenPrivacyNotice,
      locale,
    });
  const [showShieldTooltip, setShowShieldTooltip] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editingNickname, setEditingNickname] = useState("");
  const nicknameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  useEffect(() => {
    if (!hasSeenPrivacyNotice) {
      setShouldNavigateToLeaderboard(true);
      setPrivacyModalOpen(true);
    }
  }, [
    hasSeenPrivacyNotice,
    setPrivacyModalOpen,
    setShouldNavigateToLeaderboard,
  ]);

  useEffect(() => {
    const performSignIn = async () => {
      if (!hasSeenPrivacyNotice) {
        return;
      }

      if (!isFirebaseEnabled() || !auth) {
        return;
      }

      const isAuthenticated = auth.currentUser !== null;

      if (currentUid && isAuthenticated) {
        return;
      }

      try {
        const userCredential = await signInAnonymously(auth);
        const userUid = userCredential.user.uid;
        setUid(userUid);
        setAnonymousId(userUid);
        console.log("Leaderboard: Auto sign-in successful:", userUid);
      } catch (error) {
        console.error("Leaderboard: Auto sign-in failed:", error);
      }
    };

    performSignIn();
  }, [hasSeenPrivacyNotice, currentUid, setUid, setAnonymousId]);

  const getLevelTitle = useMemo(() => {
    return (levelIndex: number) => {
      const titles = locale === "TW" ? LEVEL_TITLES.TW : LEVEL_TITLES.EN;
      return titles[levelIndex] || titles[0];
    };
  }, [locale]);

  const currentUserRank =
    entries.findIndex((entry) => entry.uid === currentUid) + 1;
  const { tier: currentTier, index: currentLevelIndex } = calculateLevel(
    currentTotalEarned,
    locale,
  );

  const handleStartEdit = () => {
    setEditingNickname(nickname);
    setIsEditingNickname(true);
    setTimeout(() => {
      nicknameInputRef.current?.focus();
    }, 0);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const truncated = truncateByWeightWithoutEllipsis(newValue, MAX_WEIGHT);
    setEditingNickname(truncated);
  };

  const handleSaveNickname = async () => {
    await haptics.light();

    const trimmedNickname = editingNickname.trim() || t("anonymousAlchemist");
    const finalNickname = truncateByWeight(trimmedNickname, MAX_WEIGHT);
    setNickname(finalNickname);
    setIsEditingNickname(false);

    if (currentUid && isFirebaseEnabled()) {
      try {
        await syncToCloud();
        console.log("Nickname updated and synced to cloud");
      } catch (error) {
        console.error("Failed to sync nickname:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingNickname(false);
    setEditingNickname("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveNickname();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const weightDisplay = useMemo(() => {
    return formatWeightDisplay(editingNickname, MAX_WEIGHT);
  }, [editingNickname]);

  return (
    <div className={styles.container}>
      {!hasSeenPrivacyNotice && (
        <div className={styles.loading}>{t("privacyNoticeRequired")}</div>
      )}

      {hasSeenPrivacyNotice && loading && (
        <div className={styles.loading}>{t("loading")}</div>
      )}

      {hasSeenPrivacyNotice && error && (
        <div className={styles.error}>{t("error.firebase")}</div>
      )}

      {hasSeenPrivacyNotice && !loading && !error && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>{t("leaderboardTitle")}</h1>

            <div
              className={styles.shieldContainer}
              onMouseEnter={() => setShowShieldTooltip(true)}
              onMouseLeave={() => setShowShieldTooltip(false)}
              onTouchStart={() => setShowShieldTooltip(true)}
              onTouchEnd={() =>
                setTimeout(() => setShowShieldTooltip(false), 2000)
              }
            >
              <div className={styles.shieldIcon}>🛡️</div>
              {showShieldTooltip &&
                createPortal(
                  <div className={styles.shieldTooltip}>
                    {t("privacy.shieldTooltip")}
                  </div>,
                  document.body,
                )}
            </div>
          </div>

          <div className={styles.globalCount}>
            {loading
              ? t("loading")
              : t("globalCount", { count: totalCount || 0 })}
          </div>

          {currentUid && (
            <div
              className={`${styles.currentUser} ${currentTier === 5 ? styles.diamondMode : ""}`}
            >
              <div className={styles.currentUserLabel}>{t("yourRank")}</div>
              <div className={styles.currentUserInfo}>
                <span className={styles.rank}>#{currentUserRank || "?"}</span>
                <div className={styles.nicknameContainer}>
                  {isEditingNickname ? (
                    <div className={styles.nicknameInputWrapper}>
                      <input
                        ref={nicknameInputRef}
                        type="text"
                        className={styles.nicknameInput}
                        value={editingNickname}
                        onChange={handleNicknameChange}
                        onBlur={handleSaveNickname}
                        onKeyDown={handleKeyDown}
                      />
                      <span className={styles.weightCounter}>
                        {weightDisplay}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={styles.nickname}>
                        {truncateByWeight(
                          nickname || (locale === "TW" ? "你" : "You"),
                          MAX_WEIGHT,
                        )}
                      </span>
                      <button
                        className={styles.editButton}
                        onClick={handleStartEdit}
                        aria-label={t("editNickname")}
                      >
                        ✏️
                      </button>
                    </>
                  )}
                </div>
                <span className={styles.amount}>
                  {formatCurrency(currentTotalEarned, locale)}
                </span>
                <span
                  className={styles.tierBadge}
                  style={{ color: getTierColor(currentTier) }}
                >
                  {getTierIcon(currentTier)} {getLevelTitle(currentLevelIndex)}
                </span>
              </div>
            </div>
          )}

          <div className={styles.leaderboard}>
            {entries.map((entry) => {
              const handleEntryClick = async () => {
                await haptics.light();
              };

              return (
                <div
                  key={entry.uid}
                  className={`${styles.entry} ${entry.uid === currentUid ? styles.currentUserEntry : ""} ${entry.tier === 5 ? styles.diamondEntry : ""}`}
                  onClick={handleEntryClick}
                >
                  <div className={styles.rank}>{entry.rank}</div>
                  <div
                    className={styles.tierIcon}
                    style={{ color: getTierColor(entry.tier) }}
                  >
                    {getTierIcon(entry.tier)}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.nickname}>
                      {truncateByWeight(entry.nickname, MAX_WEIGHT)}
                    </div>
                    <div className={styles.levelTitle}>{entry.levelTitle}</div>
                    <div className={styles.amount}>
                      {formatCurrency(
                        entry.totalEarned,
                        entry.locale === "TW" || entry.locale === "EN"
                          ? entry.locale
                          : locale,
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && !loading && (
            <div className={styles.loadMoreContainer}>
              <button
                className={styles.loadMoreButton}
                onClick={fetchMore}
                aria-label={t("loadMore")}
              >
                {t("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
