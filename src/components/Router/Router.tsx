import { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import AlchemyDisplay from '../AlchemyDisplay/AlchemyDisplay';
import SalaryInput from '../SalaryInput/SalaryInput';
import Leaderboard from '../Leaderboard/Leaderboard';

type Route = '/' | '/settings' | '/leaderboard';

const Router = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.slice(1) || '/';
      // 確保 hash 以 / 開頭，以匹配 Route 類型
      // 例如：#leaderboard -> /leaderboard
      if (hash && !hash.startsWith('/')) {
        hash = '/' + hash;
      }
      // 確保能正確偵測到 #leaderboard 並渲染組件
      setCurrentRoute(hash as Route);
    };

    // 初始載入時檢查 hash
    handleHashChange();

    // 監聽 hash 變化
    window.addEventListener('hashchange', handleHashChange);
    
    // 也監聽 popstate 事件（瀏覽器前進/後退）
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return (
          <>
            <AlchemyDisplay />
            <SalaryInput />
          </>
        );
      case '/settings':
        return (
          <div>
            <h2>Settings</h2>
            {/* 設定頁面內容 */}
          </div>
        );
      case '/leaderboard':
        return <Leaderboard />;
      default:
        return (
          <>
            <AlchemyDisplay />
            <SalaryInput />
          </>
        );
    }
  };

  return <Layout>{renderRoute()}</Layout>;
};

export default Router;
