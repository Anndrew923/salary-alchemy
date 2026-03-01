import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salaryalchemy.app',
  // 與 android/app/src/main/res/values/strings.xml app_name 保持一致（Architecture First）
  appName: 'Wage Transmuter',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
