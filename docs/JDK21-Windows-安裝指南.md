# Windows 版 JDK 21 安裝指南（Boss 專用）

本專案 Android 編譯已改為使用 **Java 21**，請在本地電腦安裝 JDK 21 並設定環境，再執行建置。

---

## 一、下載 JDK 21（擇一即可）

### 方案 A：Microsoft Build of OpenJDK 21（建議）

- **下載頁**：<https://learn.microsoft.com/zh-tw/java/openjdk/download#openjdk-21>
- 選擇 **Windows x64** 的 **.msi** 安裝檔。
- 安裝時可勾選「設定 JAVA_HOME」等選項，路徑通常為：  
  `C:\Program Files\Microsoft\jdk-21.x.x`

### 方案 B：Oracle JDK 21

- **下載頁**：<https://www.oracle.com/java/technologies/downloads/#java21>
- 選擇 **Windows** → **x64 Installer**。
- 安裝後預設路徑通常為：  
  `C:\Program Files\Java\jdk-21`

---

## 二、一鍵檢查 JAVA_HOME（PowerShell）

安裝完成後，在 **PowerShell** 中執行以下指令，確認 `JAVA_HOME` 是否指向 JDK 21：

```powershell
# 檢查目前 JAVA_HOME
$env:JAVA_HOME

# 檢查該路徑下的 Java 版本（應顯示 21）
& "$env:JAVA_HOME\bin\java.exe" -version
```

若尚未設定或路徑錯誤，可**暫時**在當前 PowerShell 視窗設定（依實際安裝路徑修改）：

```powershell
# Microsoft OpenJDK 21 範例（請改成你電腦上的實際路徑）
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.5"

# 或 Oracle JDK 21 範例
# $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# 再次檢查版本
& "$env:JAVA_HOME\bin\java.exe" -version
```

若要**永久**設定系統環境變數，請：

1.  Win + R → 輸入 `sysdm.cpl` → 確定  
2. **進階** → **環境變數**  
3. 在「系統變數」中新增或編輯 `JAVA_HOME`，值為 JDK 21 的安裝目錄（例如 `C:\Program Files\Microsoft\jdk-21.0.5`）。

---

## 三、專案內 Gradle 專用 JDK（可選）

為避免與系統其他程式衝突，本專案已在 `android/gradle.properties` 預留設定，讓 Gradle **僅**使用 JDK 21：

1. 用記事本或 VS Code 開啟專案根目錄下的 **`android/gradle.properties`**。
2. 找到被註解掉的 `org.gradle.java.home` 那幾行。
3. 取消註解**其中一行**，並把路徑改成你電腦上 JDK 21 的實際安裝路徑（Windows 路徑中的 `\` 要寫成 `\\`）：

```properties
# 範例：Microsoft OpenJDK 21
org.gradle.java.home=C:\\Program Files\\Microsoft\\jdk-21.0.5

# 或 Oracle JDK 21
# org.gradle.java.home=C:\\Program Files\\Java\\jdk-21
```

存檔後，在專案目錄執行 `.\gradlew.bat` 或透過 Android Studio 建置時，Gradle 會使用此 JDK，無須依賴系統預設 Java。

---

## 四、驗證

在專案根目錄的 **`android`** 資料夾下執行：

```powershell
cd android
.\gradlew.bat -version
```

若顯示的 JVM 為 21，即表示環境與專案設定正確。

---

**布魯斯已將 `android/app/build.gradle` 恢復為 Java 21，並在 `android/gradle.properties` 準備好註解範例；Boss 回家後依本指南安裝 JDK 21 並依需要設定 `org.gradle.java.home` 即可。**
