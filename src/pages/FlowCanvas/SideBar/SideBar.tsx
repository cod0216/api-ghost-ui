import styles from './Sidebar.module.scss';
import ApiList from '../ApiList/ApiList.tsx';
import ScenarioList from '../ScenarioList/ScenarioList.tsx';

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
