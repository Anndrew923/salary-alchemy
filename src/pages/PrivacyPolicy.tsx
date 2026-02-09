import { useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useUserStore } from "../stores/userStore";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const locale = useUserStore((s) => s.locale);

  useEffect(() => {
    i18n.changeLanguage(locale === "TW" ? "zh-TW" : "en-US");
  }, [locale, i18n]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#/settings";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("privacyPolicyPage.title")}</h1>
      <p className={styles.updated}>{t("privacyPolicyPage.updated")}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("privacyPolicyPage.section1Title")}</h2>
        <p>
          <Trans
            i18nKey="privacyPolicyPage.section1Content"
            components={{ 1: <strong /> }}
          />
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("privacyPolicyPage.section2Title")}</h2>
        <p>{t("privacyPolicyPage.section2Intro")}</p>
        <ul className={styles.list}>
          <li>
            <strong>{t("privacyPolicyPage.section2Admob")}</strong>{" "}
            <a
              href="https://policies.google.com/privacy"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("privacyPolicyPage.privacyLink")}
            </a>
          </li>
          <li>
            <strong>{t("privacyPolicyPage.section2Firebase")}</strong>{" "}
            <a
              href="https://firebase.google.com/support/privacy"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("privacyPolicyPage.privacyLink")}
            </a>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("privacyPolicyPage.section3Title")}</h2>
        <p>{t("privacyPolicyPage.section3Content")}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("privacyPolicyPage.section4Title")}</h2>
        <p>
          {t("privacyPolicyPage.section4Content")}{" "}
          <strong>{t("privacyPolicyPage.section4Email")}</strong>
        </p>
      </section>

      <button
        type="button"
        onClick={handleBack}
        className={styles.backButton}
      >
        {t("privacyPolicyPage.backButton")}
      </button>
    </div>
  );
};

export default PrivacyPolicy;
