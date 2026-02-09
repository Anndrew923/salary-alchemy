import { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import AlchemyDisplay from '../AlchemyDisplay/AlchemyDisplay';
import SalaryInput from '../SalaryInput/SalaryInput';
import Leaderboard from '../Leaderboard/Leaderboard';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import Settings from '../../pages/Settings';
import Collection from '../../pages/Collection';
import styles from './Router.module.css';

type Route = '/' | '/settings' | '/leaderboard' | '/privacy' | '/collection';

const Router = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.slice(1) || '/';
      if (hash && !hash.startsWith('/')) {
        hash = '/' + hash;
      }
      setCurrentRoute(hash as Route);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
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
        return <Settings />;
      case '/privacy':
        return <PrivacyPolicy />;
      case '/leaderboard':
        return <Leaderboard />;
      case '/collection':
        return <Collection />;
      default:
        return (
          <>
            <AlchemyDisplay />
            <SalaryInput />
          </>
        );
    }
  };

  return (
    <Layout>
      <div key={currentRoute} className={styles.routeContent}>
        {renderRoute()}
      </div>
    </Layout>
  );
};

export default Router;
