/**
 * MainContent component
 *
 * Displays the main content based on the selected history scenario. If a history item is provided,
 * it shows the scenario details, including the title, description, execution time, success status,
 * and a list of results. If no history is selected, a prompt is displayed to select a scenario.
 *
 * @param {object} props - The props passed to the component.
 * @param {HistoryItem | null} props.history - The history item to display, or null if no scenario is selected.
 * @returns {JSX.Element} The component to render.
 */
import { HistoryItem } from '@/types/index.ts';
import styles from './MainContent.module.scss';

const MainContent: React.FC<{ history: HistoryItem | null }> = ({ history }) => {
  // If no history is selected, empty content.
  if (!history) return <div className={styles.emptyContent}></div>;

  return (
    <div className={styles.mainContent}>
      <div className={styles.historyInfo}>
        <div>
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>

        <div className={styles.meta}>
          <div>{new Date(history.executedAt).toLocaleString()}</div>
          <div>Success: {history.isScenarioSuccess ? '✅' : '❌'}</div>
        </div>
      </div>

      <div>
        {/* Map through the results and display each result item */}
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
