/**
 * @fileoverview LatencyGraphArea component displays a section for visualizing latency data.
 *
 * This component serves as a placeholder for future latency graph rendering.
 * It includes a title and a styled container area where graphical elements can be mounted later.
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering the latency graph section.
 */
import LatencyGraph from './LatencyGraph.tsx';
import styles from './LatencyGraphArea.module.scss';
import { HistoryItem } from '@/common/types/index.ts';

interface LatencyGraphAreaProps {
  history: HistoryItem;
}

const LatencyGraphArea: React.FC<LatencyGraphAreaProps> = ({ history }) => {
  return (
    <div className={styles.latencyGraphArea}>
      <h4> Latency </h4>
      <div className={styles.graphArea}>
        <LatencyGraph history={history} />
      </div>
    </div>
  );
};

export default LatencyGraphArea;
