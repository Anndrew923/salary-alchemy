# 帶薪煉金術 (Salary Alchemy)

一個追蹤工作時間並計算實時薪資的應用程式，採用 RPG 風格設計。

## 🛠️ 技術棧

- **Framework**: Vite + React (TypeScript) ^18.3.1
- **State Management**: Zustand ^5.0.2
- **Styling**: CSS Modules (*.module.css)
- **Platform**: Capacitor ^6.0.0 (Native Mobile Wrapper)
- **Routing**: Hash-based Routing (#path)

## 📦 安裝

```bash
npm install
```

## 🚀 開發

```bash
npm run dev
```

## 🏗️ 構建

```bash
npm run build
```

## 📱 Capacitor 命令

```bash
# 同步 Web 資源到原生專案
npm run cap:sync

# 開啟 iOS 專案
npm run cap:open:ios

# 開啟 Android 專案
npm run cap:open:android
```

## 🌐 部署

專案已配置 Netlify 部署，構建輸出為 `dist` 目錄。

## 📝 功能

- ✅ 實時計算每秒/每小時薪資
- ✅ 背景計時（使用 Delta Time，不依賴 setInterval）
- ✅ RPG 等級系統（免洗實習生 → 煉金大師）
- ✅ 國際化支援（TW/EN）
- ✅ 持久化儲存（localStorage）
- ✅ 響應式設計（Mobile-First）

## 🎨 設計規範

- Web 端包裹在 `maxWidth: 480px` 容器內，模擬手機畫面
- 暗黑煉金術風格（Dark Magic Finance）
- 數字使用等寬字體（Monospace）
- 當累計煉金超過閾值時，UI 色調切換為鑽石藍
