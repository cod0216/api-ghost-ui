import styles from './Dashboard.module.scss';
import Sidebar from '@/pages/dashboard/sidebar/Sidebar.tsx';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>main</div>
    </div>
  );
};

export default Dashboard;
