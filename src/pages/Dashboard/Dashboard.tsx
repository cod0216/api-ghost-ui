import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>sidebar</div>
      <div className={styles.mainContent}>main</div>
    </div>
  );
};

export default Dashboard;
