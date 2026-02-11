import { useEffect, memo } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * 煉金風格 Toast：深色半透明背景、圓角、白色文字，
 * 定位於廣告區上方（使用 var(--visual-blocked-height) 避讓），避免被廣告遮擋。
 */
const Toast = memo(function Toast({
  message,
  visible,
  onDismiss,
  durationMs = 2000,
}: ToastProps) {
  useEffect(() => {
    if (!visible || !message) return;
    const id = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(id);
  }, [visible, message, durationMs, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
});

export default Toast;
