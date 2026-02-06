import { useTranslation } from "react-i18next";
import { useUserStore } from "../stores/userStore";
import styles from "./Settings.module.css";

const Settings = () => {
  const { t } = useTranslation();
  const locale = useUserStore((state) => state.locale);
  const setLocale = useUserStore((state) => state.setLocale);

  const toggleLocale = () => {
    setLocale(locale === "TW" ? "EN" : "TW");
  };

  return (
    <div className={styles.settings}>
      <h2 className={styles.title}>{t("settings")}</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("header.toggleLanguage")}</h3>
        <button
          type="button"
          className={styles.localeButton}
          onClick={toggleLocale}
          aria-label={t("header.toggleLanguage")}
        >
          {locale === "TW" ? "繁體中文" : "English"} → {locale === "TW" ? "EN" : "TW"}
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("privacyPolicy")}</h3>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={styles.optionButton}
              onClick={() => { window.location.hash = "#/privacy"; }}
            >
              📜 {t("privacyPolicy")}
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Settings;
