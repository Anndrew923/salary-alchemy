import styles from './AdBanner.module.css';

const AdBanner = () => {
  // Web 端使用 Mock 佔位，Native 端使用 @capacitor-community/admob
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <span className={styles.text}>Ad Banner</span>
      </div>
    </div>
  );
};

export default AdBanner;
