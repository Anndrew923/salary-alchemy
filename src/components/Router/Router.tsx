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
      const hash = window.location.hash.slice(1) || '/';
      setCurrentRoute(hash as Route);
    };

    // 初始載入
    handleHashChange();

    // 監聽 hash 變化
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
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
