# Android 發布流程（給布魯斯 Bruce）

遵循 **長遠架構** 與 **深度註解** 準則，產出發布版 AAB 與最終測試 APK。

---

## 1. 版本校對

- **位置**：`android/app/build.gradle`
- **欄位**：`versionCode`、`versionName` 已更新；版本說明註解在檔案頂部。
- **本版 (1.1.0 / versionCode 2) 重大更動**：
  - 實作動態避讓佈局 (Dynamic safe-area layout)
  - 雙擊退出機制 (Double-tap back to exit)
  - UI 優化與架構重構

**Git Commit 建議註解**（可貼在 commit message）：

```
Release 1.1.0 (versionCode 2)
- 動態避讓佈局、雙擊退出機制
- UI 優化與架構重構
```

---

## 2. Production Key 簽署設定（長遠計畫）

**嚴禁將密碼寫在 build.gradle**。簽署資訊一律放在 **`android/key.properties`**（已列入 .gitignore）。

1. **首次建立金鑰庫**：請依 **[金鑰庫建立指南](KEYSTORE-SETUP.md)** 使用 `keytool` 或 Android Studio 產生 `.jks`，並**明確記錄 Alias**、**Store Password**、**Key Password**，交由 Boss 保存。
2. 在 **`android/`** 目錄下，將 `key.properties.example` 複製為 **`key.properties`**，填入實際值：

   ```properties
   storeFile=release.jks
   storePassword=您的_Store_Password
   keyAlias=salary-alchemy
   keyPassword=您的_Key_Password
   ```

3. `storeFile` 為相對於 **`android/`** 的路徑（例如 `release.jks` 表示 `android/release.jks`）。  
   若未設定 `key.properties`，Release 仍可建置，但不會以 Production Key 簽署（僅供除錯）。

**保存與備份**：請 Boss 將此 **`.jks` 檔案與密碼存放在加密雲端或保險箱中 — 這是 App 的命根子。** 遺失後無法以同一金鑰更新既有 App。

---

## 3. 最終檢查 (Architecture First)

### 3.1 Web 資源優化並打包進原生

從**專案根目錄**執行：

```bash
npm run build
npx cap sync android
```

- 確保 `dist/` 已產出且內容正確。
- `cap sync android` 會將 `dist/` 同步到 `android/app/src/main/assets/public`（或 Capacitor 指定路徑），供原生容器載入。

### 3.2 混淆 (ProGuard/R8) 設定

- **位置**：`android/app/build.gradle` 中 `release` 已設定：
  - `minifyEnabled true`
  - `shrinkResources true`
  - `proguardFiles` 使用 `proguard-android-optimize.txt` + `proguard-rules.pro`
- **規則**：`android/app/proguard-rules.pro` 已包含：
  - Capacitor / WebView 保留規則（確保橋接正常）
  - Firebase、AdMob 保留規則
  - 鍊金演算法邏輯位於 Web 資源 (dist/)，由 Vite 打包；R8 僅混淆原生層，降低逆向風險。

**重要**：若未設定 `android/key.properties`，Release 建置仍可成功，但 APK 會是 `app-release-unsigned.apk`，AAB 可能為 debug 簽署。正式上架與給 Boss 驗收請務必依 [KEYSTORE-SETUP.md](KEYSTORE-SETUP.md) 設定 Production Key 後重新產出。

---

## 4. 產出 AAB（Google Play 上架用）

從**專案根目錄**：

```bash
npm run build:android
cd android
gradlew.bat bundleRelease
```

- **Windows**：`gradlew.bat bundleRelease`
- **Mac/Linux**：`./gradlew bundleRelease`

產出位置：`android/app/build/outputs/bundle/release/app-release.aab`

---

## 5. 產出 Release APK（Boss 實機驗收用）

從**專案根目錄**（若已執行過 `npm run build:android` 可略過第一步）：

```bash
npm run build:android
cd android
gradlew.bat assembleRelease
```

- **Windows**：`gradlew.bat assembleRelease`
- **Mac/Linux**：`./gradlew assembleRelease`

產出位置：`android/app/build/outputs/apk/release/app-release.apk`

---

## 6. 一鍵腳本（可選）

專案根目錄已提供：

- **建置 Web 並同步到 Android**：`npm run build:android`
- **產出 AAB**：`npm run release:aab`（會先執行 build:android，再執行 bundleRelease）
- **產出 APK**：`npm run release:apk`（會先執行 build:android，再執行 assembleRelease）

Windows 下使用 `gradlew.bat`；若在 Mac/Linux 請改為在 `android/` 下手動執行 `./gradlew bundleRelease` 與 `./gradlew assembleRelease`。

---

## 7. 檢查清單

- [ ] `versionCode` / `versionName` 已更新，且註解與 Commit 一致
- [ ] `android/key.properties` 已設定，且 `.jks` 與密碼已由 Boss 妥善備份（見 [KEYSTORE-SETUP.md](KEYSTORE-SETUP.md)）
- [ ] `npm run build` 成功，`dist/` 已優化
- [ ] `npx cap sync android` 已執行
- [ ] ProGuard/R8 規則已確認（Capacitor / Firebase / AdMob 保留）
- [ ] `app-release.aab` 已產出並可上傳 Google Play
- [ ] `app-release.apk` 已產出並可提供 Boss 實機驗收
