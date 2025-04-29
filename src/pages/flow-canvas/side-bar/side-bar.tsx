import styles from './side-bar.module.scss';
import ApiList from '../api-list/api-list.tsx';
import ScenarioList from '../scenario-list/scenario-list.tsx';

const SideBar = () => {
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

export default SideBar;
