import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getExchangeItem, getRandomExchangeMsg } from '../../utils/equivalentExchange';
import { formatCurrency, getI18n } from '../../utils/i18n';
import { useUserStore } from '../../stores/userStore';
import styles from './ReceiptCard.module.css';

interface ReceiptCardProps {
  earned: number;
  minutes: number;
  onClose: () => void;
}

const ReceiptCard = ({ earned, minutes, onClose }: ReceiptCardProps) => {
  const { locale } = useUserStore();
  const { i18n } = useTranslation();
  const i18nStrings = getI18n(locale);
  
  // 同步語言設定
  useEffect(() => {
    i18n.changeLanguage(locale === 'TW' ? 'zh-TW' : 'en-US');
  }, [locale, i18n]);

  const currency = locale === 'TW' ? 'TWD' : 'USD';
  const exchangeResult = getExchangeItem(earned, minutes, currency);
  const { item, desc } = getRandomExchangeMsg(exchangeResult.key);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.receiptCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.receiptHeader}>
          <div className={styles.receiptTitle}>{i18nStrings.receiptTitle}</div>
          <div className={styles.receiptSubtitle}>{i18nStrings.receiptSubtitle}</div>
        </div>

        <div className={styles.receiptBody}>
          <div className={styles.exchangeIcon}>{exchangeResult.icon}</div>
          <div className={styles.itemName}>{item}</div>
          <div className={styles.itemDesc}>{desc}</div>
          
          <div className={styles.receiptDivider} />
          
          <div className={styles.receiptDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{i18nStrings.receiptAmount}</span>
              <span className={`${styles.detailValue} monospace`}>
                {formatCurrency(earned, locale)}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{i18nStrings.receiptTime}</span>
              <span className={`${styles.detailValue} monospace`}>
                {Math.floor(minutes)} {locale === 'TW' ? '分鐘' : 'min'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{i18nStrings.receiptType}</span>
              <span className={styles.detailValue}>
                {exchangeResult.type === 'HEALTH' ? i18nStrings.receiptTypeHealth : i18nStrings.receiptTypeWealth}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.receiptFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            {i18nStrings.receiptConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
