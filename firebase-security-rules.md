# Firebase Firestore 安全性規則

## 📋 說明

為了防止惡意灌票和數據篡改，請在 Firebase Console 中設置以下安全性規則。

## 🔧 設置步驟

1. 登入 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案
3. 進入 **Firestore Database** → **規則 (Rules)**
4. 將以下規則貼上並發布

## 🛡️ 安全性規則

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 排行榜數據集合
    match /leaderboard/{userId} {
      // 允許所有人讀取（用於排行榜顯示）
      allow read: if true;
      
      // 只允許已認證的用戶寫入，且只能修改自己的文檔（UID 必須匹配）
      // 同時進行數據驗證
      allow create, update: if request.auth != null 
        && request.auth.uid == userId
        // 驗證 totalEarned：必須是數字且 >= 0
        && request.resource.data.totalEarned is number
        && request.resource.data.totalEarned >= 0
        // 驗證 normalizedScore：必須是數字且 >= 0
        && request.resource.data.normalizedScore is number
        && request.resource.data.normalizedScore >= 0
        // 驗證 nickname：必須是字串且長度不超過 20 個字元
        && request.resource.data.nickname is string
        && request.resource.data.nickname.size() <= 20
        // 驗證 locale：必須是 'TW' 或 'EN'
        && request.resource.data.locale in ['TW', 'EN']
        // 驗證 updatedAt：必須是字串（ISO 格式）
        && request.resource.data.updatedAt is string;
      
      // 不允許刪除（保護數據完整性）
      allow delete: if false;
    }
  }
}
```

## ✅ 規則說明

- **`allow read: if true`**: 允許所有人讀取排行榜數據，這樣排行榜才能正常顯示
- **`allow create, update`**: 包含多重驗證機制
  - **身份驗證**：只允許已認證的用戶（匿名登入也算）
  - **權限控制**：只能修改自己的文檔（UID 必須匹配）
  - **數據驗證**：
    - `totalEarned` 必須是數字且 >= 0（防止負數）
    - `normalizedScore` 必須是數字且 >= 0（防止負數）
    - `nickname` 必須是字串且長度 <= 20 個字元（防止過長）
    - `locale` 必須是 'TW' 或 'EN'（防止無效值）
    - `updatedAt` 必須是字串（ISO 格式）
  - 這確保了每台手機只能修改自己的分數，且數據格式正確
- **`allow delete: if false`**: 禁止刪除，保護數據完整性

## 🔍 測試規則

在 Firebase Console 的規則編輯器中，可以使用「規則測試器」來驗證規則是否正確：

1. 點擊「規則測試器」標籤
2. 選擇「users/{userId}」集合
3. 測試不同的讀寫操作

## ⚠️ 注意事項

- 規則發布後可能需要幾分鐘才會生效
- 建議先在測試環境驗證規則
- 如果規則設置錯誤，可能會導致應用無法寫入數據
