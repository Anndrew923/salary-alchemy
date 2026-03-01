# 金鑰庫建立指南（長遠計畫 — 給布魯斯與 Boss）

本文件記錄 **全新金鑰庫 (.jks) 的生成步驟**、**Alias 與密碼規範**，以及簽署流程。  
**嚴禁將密碼寫入 build.gradle**，一律使用 `key.properties` 並排除於版控。

---

## 1. 金鑰庫生成（僅需執行一次）

### 1.1 使用 keytool 產生 .jks（建議）

在 **專案根目錄**（或任意目錄，再將產出的檔案放到 `android/`）執行：

```powershell
# Windows (PowerShell / CMD)，從專案根目錄執行
keytool -genkeypair -v -keystore android\release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias salary-alchemy
```

**註解規範 — 請明確記錄以下資訊並交由 Boss 保存：**

| 項目 | 本專案使用值 | 說明 |
|------|----------------|------|
| **Alias（別名）** | `salary-alchemy` | 建構時 key.properties 內的 `keyAlias` 必須與此一致 |
| **金鑰庫檔名** | `release.jks` | 放置於 `android/release.jks`，勿提交版控 |
| **Store Password** | （由 Boss 設定） | 開啟金鑰庫的密碼，請 Boss 妥善保存 |
| **Key Password** | （由 Boss 設定，可與 Store 相同） | 私鑰密碼，請 Boss 妥善保存 |

執行時 keytool 會提示輸入：

1. **輸入金鑰庫密碼**（兩次）→ 即 **Store Password**
2. **姓名、組織單位、組織、城市、省、國家代碼**（可填公司或 App 名稱）
3. **輸入 &lt;salary-alchemy&gt; 的密碼**（可直接 Enter 與金鑰庫相同）→ 即 **Key Password**

請在產出過程中**明確記錄 Alias**，並**提示 Boss 將 Store Password 與 Key Password 保存在安全處**。

### 1.2 使用 Android Studio 產生（替代方式）

1. 選單 **Build → Generate Signed Bundle / APK**
2. 選擇 **Android App Bundle** → Next
3. **Create new...** 建立新金鑰庫：
   - Key store path：選擇或輸入 `android/release.jks`
   - Password / Confirm：**Store Password**（請記錄）
   - Alias：**salary-alchemy**（請記錄）
   - Key password：**Key Password**（請記錄，可與 Store 相同）
   - Validity：建議 10000 天
   - Certificate 欄位可填公司或 App 名稱
4. 完成後將產出的 `release.jks` 放在 `android/` 目錄

---

## 2. 安全配置（key.properties）

1. 在 **`android/`** 目錄下，將 `key.properties.example` 複製為 **`key.properties`**。
2. 依實際金鑰庫填寫（**嚴禁提交 key.properties**）：

   ```properties
   storeFile=release.jks
   storePassword=您設定的_Store_Password
   keyAlias=salary-alchemy
   keyPassword=您設定的_Key_Password
   ```

3. `storeFile` 為相對於 **`android/`** 的路徑；若金鑰庫在 `android/release.jks`，即填 `release.jks`。

`app/build.gradle` 已內建**動態讀取**此檔，建構時會自動用於簽署 AAB/APK，無須在 build.gradle 寫入任何密碼。

---

## 3. 產出最終簽署版 AAB

從專案根目錄執行：

```powershell
npm run build:android
cd android
.\gradlew.bat bundleRelease
```

產出位置：`android/app/build/outputs/bundle/release/app-release.aab`  
此 AAB 將以 Boss 專屬金鑰簽署，可上傳 Google Play。

---

## 4. 保存與備份建議（必讀）

> **請 Boss 將此 `.jks` 檔案與密碼存放在加密雲端或保險箱中 — 這是 App 的命根子。**  
> 一旦遺失，無法再以同一金鑰更新既有 App，僅能重新上架為新應用。

建議：

- 將 `release.jks` 備份至加密磁碟或受信任的雲端（如 Google Drive 加密壓縮、公司保險箱）。
- 將 **Store Password**、**Key Password** 與 **Alias（salary-alchemy）** 記錄於密碼管理員或密封保存，勿僅存於單一電腦。
