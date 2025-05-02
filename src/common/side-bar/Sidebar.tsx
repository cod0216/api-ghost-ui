/**
 * @fileoverview Sidebar.tsx
 */

import styles from './Sidebar.module.scss';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList.tsx';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList.tsx';

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <h2>Ghost API</h2>
      <input type="text" placeholder="Search" className={styles.search} />

      <div className={styles.section}>
        <h4>API List</h4>
        <ApiList />
      </div>

      <div className={styles.section}>
        <h4>Scenarios</h4>
        <ScenarioList />
      </div>
    </div>
  );
};

export default Sidebar;
