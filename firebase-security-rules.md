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
    // 用戶數據集合
    match /users/{userId} {
      // 允許所有人讀取（用於排行榜顯示）
      allow read: if true;
      
      // 只允許已認證的用戶寫入
      // 且只能修改自己的文檔（UID 必須匹配）
      allow create, update: if request.auth != null 
        && request.auth.uid == userId;
      
      // 不允許刪除（保護數據完整性）
      allow delete: if false;
    }
  }
}
```

## ✅ 規則說明

- **`allow read: if true`**: 允許所有人讀取用戶數據，這樣排行榜才能正常顯示
- **`allow create, update: if request.auth != null && request.auth.uid == userId`**: 
  - 只允許已認證的用戶（匿名登入也算）
  - 且只能修改自己的文檔（UID 必須匹配）
  - 這確保了每台手機只能修改自己的分數，別人動不了你的帳本
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
