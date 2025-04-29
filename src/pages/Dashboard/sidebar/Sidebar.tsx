/**
 * @fileoverview Sidebar component for the dashboard page.
 * Provides navigation and request history features.
 */

import styles from './Sidebar.module.scss';

/**
 * Sidebar component displays the application title,
 * search input, and a history section for previous requests.
 *
 * @returns A React component representing the sidebar UI.
 */
const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebarContainer}>
      <h2>Ghost API</h2>
      <input type="text" placeholder="Search" className={styles.search} />
      <h4>History</h4>
      <div className={styles.historyContainer}>
        <div className={styles.historyItem}>
          Scenario 1 <span className={styles.success}>success</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
