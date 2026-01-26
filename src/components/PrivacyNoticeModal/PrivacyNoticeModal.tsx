import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../../config/firebase';
import { useUserStore } from '../../stores/userStore';
import zhTW from '../../locales/zh-TW.json';
import enUS from '../../locales/en-US.json';
import styles from './PrivacyNoticeModal.module.css';

interface PrivacyNoticeModalProps {
  onAgree: () => void;
}

const PrivacyNoticeModal = ({ onAgree }: PrivacyNoticeModalProps) => {
  const { locale, setUid, setAnonymousId, setHasSeenPrivacyNotice, setPrivacyModalOpen, shouldNavigateToLeaderboard, setShouldNavigateToLeaderboard } = useUserStore();

  const translations = locale === 'TW' ? zhTW : enUS;
  const privacy = translations.privacy;

  const handleAgree = async () => {
    // 1. 執行 setHasSeenPrivacyNotice(true)
    setHasSeenPrivacyNotice(true);
    
    // 2. 如果 Firebase 已啟用，執行匿名登入並等待完成
    if (isFirebaseEnabled() && auth) {
      try {
        const userCredential = await signInAnonymously(auth);
        const userUid = userCredential.user.uid;
        setUid(userUid);
        setAnonymousId(userUid);
        console.log('Privacy notice agreed, anonymous sign-in successful:', userUid);
      } catch (error) {
        console.error('Anonymous sign-in failed:', error);
        // 即使登入失敗，標記已設置，允許用戶繼續使用
      }
    }
    
    // 3. 關閉 Modal
    setPrivacyModalOpen(false);
    
    // 4. 如果是從排行榜入口觸發的，簽署完後自動導向 #leaderboard
    // 在登入成功後，檢查 shouldNavigateToLeaderboard 並執行跳轉
    if (shouldNavigateToLeaderboard) {
      setShouldNavigateToLeaderboard(false); // 清除標記
      // 使用 setTimeout 確保 Modal 關閉動畫完成後再導航
      setTimeout(() => {
        window.location.hash = '#leaderboard';
      }, 100);
    }
    
    // 5. 通知父組件（觸發排行榜資料抓取）
    onAgree();
  };

  // 阻止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.watermark}></div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{privacy.title}</h1>
            <p className={styles.subtitle}>{privacy.subtitle}</p>
          </div>
          
          <div className={styles.body}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔒 {privacy.sectionTitle}</h2>
              <p className={styles.text}>{privacy.content}</p>
            </div>
            
            <div className={styles.section}>
              <p className={styles.funnyText}>💬 {privacy.funnyText}</p>
            </div>
          </div>
          
          <div className={styles.footer}>
            <button 
              className={styles.agreeButton}
              onClick={handleAgree}
            >
              ✍️ {privacy.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNoticeModal;
