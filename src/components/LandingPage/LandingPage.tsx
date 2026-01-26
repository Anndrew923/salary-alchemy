import React, { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../stores/userStore';

interface Props {
  onFinish: () => void;
}

const LandingPage: React.FC<Props> = ({ onFinish }) => {
  const { locale } = useUserStore();
  const { t, i18n } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  // 同步語言設定
  useEffect(() => {
    i18n.changeLanguage(locale === 'TW' ? 'zh-TW' : 'en-US');
  }, [locale, i18n]);

  useEffect(() => {
    // 1.2秒後開始爆發與退場動畫
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1200);

    // 1.5秒後正式移除組件
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`${styles.container} ${isExiting ? styles.exit : ''}`}>
      <div className={styles.content}>
        {/* 大師鍊成陣 SVG */}
        <svg className={styles.alchemyCircle} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* 發光濾鏡效果 */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g className={styles.circleGroup} filter="url(#glow)">
            {/* 外圈與符文 */}
            <circle cx="100" cy="100" r="90" fill="none" strokeWidth="2" className={styles.ringOuter} />
            <circle cx="100" cy="100" r="82" fill="none" strokeWidth="1" className={styles.ringInner} />
            
            {/* 內部幾何結構 */}
            <path d="M100,20 L170,140 L30,140 Z" fill="none" strokeWidth="2" className={styles.triangle} />
            <path d="M100,180 L30,60 L170,60 Z" fill="none" strokeWidth="2" className={styles.triangleDown} />
            
            {/* 核心圓與元素符號 */}
            <circle cx="100" cy="100" r="30" fill="none" strokeWidth="3" className={styles.core} />
            <circle cx="100" cy="100" r="10" fill="currentColor" className={styles.coreDot} />
            
            {/* 裝飾性軌道線 */}
            <path d="M100,10 A90,90 0 0,1 190,100" fill="none" strokeWidth="1" strokeDasharray="5,5" className={styles.arc1} />
            <path d="M100,190 A90,90 0 0,1 10,100" fill="none" strokeWidth="1" strokeDasharray="5,5" className={styles.arc2} />
          </g>
        </svg>

        {/* 歡迎標語 */}
        <h1 className={styles.title}>{t('landing.title')}</h1>
        <p className={styles.subtitle}>{t('landing.subtitle')}</p>
      </div>
    </div>
  );
};

export default LandingPage;
