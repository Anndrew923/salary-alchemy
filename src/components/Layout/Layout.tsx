import { ReactNode } from 'react';
import Header from '../Header/Header';
import AdBanner from '../AdBanner/AdBanner';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.appWrapper}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <AdBanner />
      </div>
    </div>
  );
};

export default Layout;
