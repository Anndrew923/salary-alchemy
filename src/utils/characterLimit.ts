/**
 * 字符权重计算工具
 * 中文/全形字符计为 2 个单位，英文/半形字符计为 1 个单位
 */

const MAX_WEIGHT = 16; // 总限制：16 个单位（相当于 8 个中文字或 16 个英文字母）

/**
 * 判断字符是否为全形（中文、全形符号等）
 * @param char 单个字符
 * @returns 是否为全形字符
 */
const isFullWidth = (char: string): boolean => {
  const code = char.charCodeAt(0);
  // 全形字符范围：
  // - 中文字符：\u4e00-\u9fff
  // - 全形符号：\uff00-\uffef
  // - 其他全形字符：\u3000-\u303f (CJK 符号和标点)
  return (
    (code >= 0x4e00 && code <= 0x9fff) || // 中文字符
    (code >= 0xff00 && code <= 0xffef) || // 全形符号
    (code >= 0x3000 && code <= 0x303f)    // CJK 符号和标点
  );
};

/**
 * 计算字符串的权重
 * @param text 输入文本
 * @returns 权重值
 */
export const calculateTextWeight = (text: string): number => {
  let weight = 0;
  for (let i = 0; i < text.length; i++) {
    weight += isFullWidth(text[i]) ? 2 : 1;
  }
  return weight;
};

/**
 * 截断文本到指定权重（不添加省略号，用于输入时）
 * @param text 输入文本
 * @param maxWeight 最大权重（默认 16）
 * @returns 截断后的文本（不包含省略号）
 */
export const truncateByWeightWithoutEllipsis = (text: string, maxWeight: number = MAX_WEIGHT): string => {
  if (calculateTextWeight(text) <= maxWeight) {
    return text;
  }

  let currentWeight = 0;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWeight = isFullWidth(char) ? 2 : 1;

    if (currentWeight + charWeight > maxWeight) {
      break;
    }

    result += char;
    currentWeight += charWeight;
  }

  return result;
};

/**
 * 截断文本到指定权重，并在末尾添加 "..."
 * @param text 输入文本
 * @param maxWeight 最大权重（默认 16）
 * @returns 截断后的文本
 */
export const truncateByWeight = (text: string, maxWeight: number = MAX_WEIGHT): string => {
  if (calculateTextWeight(text) <= maxWeight) {
    return text;
  }

  let currentWeight = 0;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWeight = isFullWidth(char) ? 2 : 1;

    // 如果加上当前字符会超过限制（需要预留 "..." 的权重，假设为 3）
    if (currentWeight + charWeight > maxWeight - 3) {
      break;
    }

    result += char;
    currentWeight += charWeight;
  }

  return result + '...';
};

/**
 * 验证文本是否在权重限制内
 * @param text 输入文本
 * @param maxWeight 最大权重（默认 16）
 * @returns 是否在限制内
 */
export const isWithinWeightLimit = (text: string, maxWeight: number = MAX_WEIGHT): boolean => {
  return calculateTextWeight(text) <= maxWeight;
};

/**
 * 获取剩余可用权重
 * @param text 输入文本
 * @param maxWeight 最大权重（默认 16）
 * @returns 剩余权重
 */
export const getRemainingWeight = (text: string, maxWeight: number = MAX_WEIGHT): number => {
  const currentWeight = calculateTextWeight(text);
  return Math.max(0, maxWeight - currentWeight);
};

/**
 * 格式化权重显示（用于计数器）
 * @param text 输入文本
 * @param maxWeight 最大权重（默认 16）
 * @returns 格式化的字符串，如 "8/8" 或 "16/16"
 */
export const formatWeightDisplay = (text: string, maxWeight: number = MAX_WEIGHT): string => {
  const currentWeight = calculateTextWeight(text);
  return `${currentWeight}/${maxWeight}`;
};

export { MAX_WEIGHT };
