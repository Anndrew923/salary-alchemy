import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = '#/settings';
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>《帶薪煉金術》隱私權政策</h1>
      <p className={styles.updated}>最近更新日期：2026年2月6日</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 資料收集與使用</h2>
        <p>
          本 App 致力於保護您的隱私。我們<strong>不會</strong>
          收集、存取或儲存您的任何個人識別資訊（如姓名、Email 或聯絡電話）。所有煉金數據均儲存於您的本地設備或以匿名方式處理。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 第三方服務供應商</h2>
        <p>
          為了維持營運與提供功能，我們使用了以下服務。您可以點擊連結查看其隱私權政策：
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Google AdMob：</strong> 用於投放廣告。
            <a
              href="https://policies.google.com/privacy"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              隱私權條款
            </a>
          </li>
          <li>
            <strong>Firebase (Google)：</strong> 用於運行數據統計與全球排行榜。
            <a
              href="https://firebase.google.com/support/privacy"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              隱私權條款
            </a>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 兒童隱私</h2>
        <p>
          本服務不針對 13 歲（或所在地法律規定年齡）以下之兒童。我們不會蓄意收集兒童的個人資訊。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. 聯絡我們</h2>
        <p>
          若您對本政策有任何疑問，請透過以下電子郵件聯繫：
          <strong>topaj01@gmail.com</strong>
        </p>
      </section>

      <button
        type="button"
        onClick={handleBack}
        className={styles.backButton}
      >
        返回
      </button>
    </div>
  );
};

export default PrivacyPolicy;
