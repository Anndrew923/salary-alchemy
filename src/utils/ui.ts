/**
 * UI 工具函數
 */

/**
 * 根據金額字串長度返回對應的字體大小 Class
 * @param amountString 格式化後的金額字串
 * @returns CSS Class 名稱 ('amountLarge' | 'amountMedium' | 'amountSmall')
 */
export const getFontSizeClass = (amountString: string): string => {
  const length = amountString.length;
  if (length <= 10) {
    return "amountLarge";
  } else if (length <= 13) {
    return "amountMedium";
  } else {
    return "amountSmall";
  }
};
