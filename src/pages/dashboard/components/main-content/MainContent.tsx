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
import { HistoryItem } from '@/common/types/index.ts';
import styles from '@/pages/dashboard/styles/MainContent.module.scss';
import FlowGraphArea from '@/pages/dashboard/components/flow-graph-area/FlowGraphArea.tsx';
import LatencyGraphArea from '@/pages/dashboard/components/latency-graph-area/LatencyGrahpArea.tsx';
import TableArea from '@/pages/dashboard/components/table-area/TableArea.tsx';

interface MainContentProps {
  history: HistoryItem | null;
  className: string;
}

const MainContent: React.FC<MainContentProps> = ({ history, className }) => {
  // If no history is selected, empty content.
  if (!history) return <div className={`${styles.emptyContent} ${className}`}></div>;

  return (
    <div className={className}>
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

      <div className={styles.chartContainer}>
        <FlowGraphArea className={styles.flowGraphArea} results={history.results} />
        <LatencyGraphArea className={styles.latencyGraphArea} history={history} />
        <TableArea className={styles.tableArea} results={history.results} />
      </div>
    </div>
  );
};

export default MainContent;
