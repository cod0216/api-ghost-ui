import React from 'react';
import { ScenarioTestDetailResponse } from '@/pages/dashboard/types/index.ts';
import styles from '@/pages/dashboard/styles/MainContent.module.scss';
import FlowGraphArea from '@/pages/dashboard/components/flow-graph-area/FlowGraphArea.tsx';
import LatencyGraphArea from '@/pages/dashboard/components/latency-graph-area/LatencyGrahpArea.tsx';
import TableArea from '@/pages/dashboard/components/table-area/TableArea.tsx';

interface MainContentProps {
  scenarioTestResult: ScenarioTestDetailResponse | null;
  className: string;
}

/**
 * Displays the main content of the dashboard for a selected scenario test.
 *
 * If no scenario test is selected, shows an empty placeholder.
 * Otherwise, renders scenario metadata, flow graph, latency graph, and result table.
 *
 * @param props - Component props including the selected test result and optional class name.
 * @returns The detailed view of the scenario test results.
 *
 * @author haerim-kweon
 */
const MainContent: React.FC<MainContentProps> = ({ scenarioTestResult, className }) => {
  // If no scenarioTestResult is selected, empty content.
  if (!scenarioTestResult) return <div className={`${styles.emptyContent} ${className}`}></div>;

  return (
    <div className={className}>
      <div className={styles.historyInfo}>
        <div>
          <h2>{scenarioTestResult.name}</h2>
          <p>{scenarioTestResult.description}</p>
        </div>

        <div className={styles.meta}>
          <div>{new Date(scenarioTestResult.executedAt).toLocaleString()}</div>
          <div>Success: {scenarioTestResult.isScenarioSuccess ? '✅' : '❌'}</div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <FlowGraphArea className={styles.flowGraphArea} results={scenarioTestResult.results} />
        <LatencyGraphArea
          className={styles.latencyGraphArea}
          scenarioTestResult={scenarioTestResult}
        />
        <TableArea className={styles.tableArea} results={scenarioTestResult.results} />
      </div>
    </div>
  );
};

export default MainContent;
