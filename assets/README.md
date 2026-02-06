# 帶薪煉金術 — App 圖示與資源

此資料夾為 **@capacitor/assets** 的來源目錄，請將圖檔放在下列路徑，之後在專案根目錄執行 `npm run cap:assets` 即可一鍵產生各平台圖示。

---

## 預期路徑（Boss 請將神像請進這裡）

| 用途 | 路徑 | 規格說明 |
|------|------|----------|
| **母圖（主圖示）** | `assets/icon.png` | Boss 的 1024×1024 黃金馬桶圖騰原始檔，請放於此處。 |
| **背景層（Android 適應性圖示）** | `assets/icon-background.png` | 已由布魯斯預先產生純黑背景圖，無須替換；若需自訂可覆蓋此檔。 |

---

## 使用流程

1. 將 **1024×1024** 的 `icon.png`（黃金圖騰）放到本資料夾，覆蓋或建立 `assets/icon.png`。
2. （可選）若要自訂 Android 適應性圖示背景，可替換 `assets/icon-background.png`。
3. 在專案根目錄執行：
   ```bash
   npm run cap:assets
   ```
4. 完成後再執行 `npm run cap:sync` 同步到各平台專案。

---

*路徑已確認，與 @capacitor/assets 預設讀取之 `assets` 目錄一致。*
