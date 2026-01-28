import { useEffect } from "react";
import { AdService } from "../../services/adService";
import { isNative } from "../../utils/ui";
import styles from "./AdBanner.module.css";

const AdBanner = () => {
  useEffect(() => {
    if (isNative()) {
      AdService.showBanner();
    }

    // 元件卸載時隱藏廣告，避免在不需要的畫面出現
    return () => {
      if (isNative()) {
        AdService.hideBanner();
      }
    };
  }, []);

  return (
    <div className={styles.bannerContainer}>
      {!isNative() && (
        <div className={styles.webPlaceholder}>
          Passive Alchemy Booster (Ad Banner)
        </div>
      )}
    </div>
  );
};

export default AdBanner;

