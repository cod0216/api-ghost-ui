import styles from './Sidebar.module.scss';

const Sidebar = () => {
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
