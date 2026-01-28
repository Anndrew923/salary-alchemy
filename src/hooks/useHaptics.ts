import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * 封裝 Capacitor Haptics 的 Hook
 * 提供統一的觸覺回饋接口，並包含錯誤處理
 */
export const useHaptics = () => {
  /**
   * 觸發輕度震動
   */
  const light = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  /**
   * 觸發中度震動
   */
  const medium = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  /**
   * 觸發重度震動
   */
  const heavy = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  /**
   * 觸發一般震動
   */
  const vibrate = async () => {
    try {
      await Haptics.vibrate();
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  /**
   * 根據 tier 觸發對應的震動強度
   * @param tier 等級階層 (1-5)
   */
  const byTier = async (tier: number) => {
    try {
      if (tier >= 5) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
        await new Promise(resolve => setTimeout(resolve, 200));
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (tier >= 3) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  return {
    light,
    medium,
    heavy,
    vibrate,
    byTier,
  };
};
