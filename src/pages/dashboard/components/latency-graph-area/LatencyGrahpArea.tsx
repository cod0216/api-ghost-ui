import React from 'react';
import LatencyGraph from '@/pages/dashboard/components/latency-graph-area/LatencyGraph.tsx';
import styles from '@/pages/dashboard/styles/LatencyGraphArea.module.scss';
import { ScenarioTestDetailResponse } from '@/pages/dashboard/types/index.ts';

interface LatencyGraphAreaProps {
  scenarioTestResult: ScenarioTestDetailResponse;
  className: string;
}
/**
 * Renders the latency graph area section.
 *
 * Displays latency information of the scenario test in graphical form.
 *
 * @param props - Component props including scenario result data and styling class name.
 * @returns A component showing the latency graph of the test scenario.
 *
 * @author haerim-kweon
 */
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
