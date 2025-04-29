/**
 * @fileoverview Top-level component for the result dashboard page layout,
 * including sidebar and main content area.
 */

import styles from './Dashboard.module.scss';
import Sidebar from '@/pages/dashboard/sidebar/Sidebar.tsx';
import MainContent from './main-content/MainContent.tsx';

/**
 * Dashboard component responsible for rendering the main layout of the dashboard page.
 * TODO: main content component
 * @returns A React component that displays the sidebar and main content area.
 */
const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;
