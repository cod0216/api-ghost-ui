import { HistoryItem } from '@/types/index.ts';
import styles from './MainContent.module.scss';

const MainContent: React.FC<{ history: HistoryItem | null }> = ({ history }) => {
  if (!history) return <div className={styles.mainContent}>Select a scenario</div>;

  return (
    <div className={styles.mainContent}>
      <div className={styles.historyInfo}>
        <div>
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>

        <div className={styles.meta}>
          <div>Executed At: {new Date(history.executedAt).toLocaleString()}</div>
          <div>Success: {history.isScenarioSuccess ? '✅' : '❌'}</div>
        </div>
      </div>

      <div>
        {history.results.map((res, idx) => (
          <div key={idx} className={styles.resultItem}>
            <strong>
              {res.method} {res.endpoint}
            </strong>
            <span className={styles.status}>- {res.statusCode}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
