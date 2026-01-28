import {
  AdMob,
  RewardAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { isNative } from "../utils/ui";

/**
 * AdMob 激勵廣告服務 (Singleton)
 *
 * - 在 App 啟動時呼叫 `AdService.initialize()`
 * - 在需要給獎勵的地方呼叫 `AdService.showRewardedAd()`
 */
export class AdService {
  private static isInitialized = false;

  private static getRewardedAdId(): string {
    const platform = Capacitor.getPlatform();

    // 開發 / 測試期間：一律使用 Google 官方 Rewarded 測試 ID
    // 參考：https://developers.google.com/admob/android/test-ads
    const googleOfficialTestId = "ca-app-pub-3940256099942544/5224354917";

    console.info(
      `[AdService] 平台 (${platform}) 使用 Google 官方 Rewarded 測試 ID：${googleOfficialTestId}`,
    );

    return googleOfficialTestId;
  }

  // 初始化 AdMob
  static async initialize() {
    // Web 端不需要初始化，直接略過
    if (!isNative()) {
      console.info("[AdService] Web 環境略過 AdMob 初始化。");
      this.isInitialized = true;
      return;
    }

    if (this.isInitialized) return;

    await AdMob.initialize({
      // 開發階段可加上測試裝置 ID
      // testingDevices: ['YOUR_DEVICE_ID'],
      initializeForTesting: true, // Boss 測試階段：強制啟用 Testing 模式
    });

    this.isInitialized = true;
    console.info(
      "[AdService] AdMob Initialized (initializeForTesting: true, FORCE TEST IDS ENABLED)",
    );
  }

  // 顯示底部橫幅廣告 (Android 優先)
  static async showBanner(): Promise<void> {
    if (!isNative()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env || {};
    const adId =
      (env.VITE_ADMOB_BANNER_AD_ID_ANDROID as string | undefined) ??
      "TEST_ANDROID_BANNER_ID";

    try {
      await AdMob.showBanner({
        adId,
        adSize: BannerAdSize.ADAPTIVE_BANNER, // 使用自適應橫幅以獲得最佳收益與適配
        position: BannerAdPosition.BOTTOM_CENTER,
        // Android 15 底部導覽列 (手勢列) 會吃掉一部分 Banner，
        // 利用 margin 將橫幅往上「頂」出安全區域。
        // 實測範圍約 24dp ~ 48dp，這裡取中間值 30px，之後可依實機再微調。
        margin: 30,
        // isTesting 建議也走環境變數控制，Boss 測試階段一律使用測試流量
        isTesting: true,
      });
    } catch (error) {
      console.error("[AdService] Failed to show banner:", error);
    }
  }

  // 隱藏橫幅廣告
  static async hideBanner(): Promise<void> {
    if (!isNative()) return;
    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error("[AdService] Failed to hide banner:", error);
    }
  }

  // 顯示激勵影片廣告
  static async showRewardedAd(): Promise<boolean> {
    // 如果是在 Web 環境，直接回傳成功（開發測試用）
    if (!isNative()) {
      console.log(
        "[AdService] Web mode: Skipping ad and granting reward directly.",
      );
      return true;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const options: RewardAdOptions = {
        adId: this.getRewardedAdId(),
        // isTesting: true, // 若要強制測試模式可打開
      };

      await AdMob.prepareRewardVideoAd(options);

      const reward = await AdMob.showRewardVideoAd();

      if (reward && reward.amount > 0) {
        console.log("[AdService] Reward granted:", reward);
        return true;
      }

      console.warn("[AdService] Rewarded ad finished without reward.");
      return false;
    } catch (error) {
      console.error("[AdService] Error while showing rewarded ad:", error);
      return false;
    }
  }
}
