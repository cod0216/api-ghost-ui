/**
 * @fileoverview LatencyGraphArea component displays a section for visualizing latency data.
 *
 * This component serves as a placeholder for future latency graph rendering.
 * It includes a title and a styled container area where graphical elements can be mounted later.
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering the latency graph section.
 */
import LatencyGraph from '@/pages/dashboard/components/latency-graph-area/LatencyGraph.tsx';
import styles from '@/pages/dashboard/styles/LatencyGraphArea.module.scss';
import { ScenarioTestDetailResponse } from '@/common/types/index.ts';

interface LatencyGraphAreaProps {
  scenarioTestResult: ScenarioTestDetailResponse;
  className: string;
}

const LatencyGraphArea: React.FC<LatencyGraphAreaProps> = ({ scenarioTestResult, className }) => {
  return (
    <div className={className}>
      <h4> Latency </h4>
      <div className={styles.graphArea}>
        <LatencyGraph scenarioTestResult={scenarioTestResult} />
      </div>
    </div>
  );
};

export default LatencyGraphArea;
