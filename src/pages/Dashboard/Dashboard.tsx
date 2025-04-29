/**
 * @fileoverview Top-level component for the result dashboard page layout,
 * including sidebar and main content area.
 */

import styles from './Dashboard.module.scss';
import Sidebar from '@/pages/dashboard/sidebar/Sidebar.tsx';

/**
 * Dashboard component responsible for rendering the main layout of the dashboard page.
 * TODO: main content component
 * @returns A React component that displays the sidebar and main content area.
 */
const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>main</div>
    </div>
  );
};

export default Dashboard;
