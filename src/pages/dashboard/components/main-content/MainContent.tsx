import React from 'react';
import { ScenarioTestDetailResponse } from '@/common/types/index.ts';
import styles from '@/pages/dashboard/styles/MainContent.module.scss';
import FlowGraphArea from '@/pages/dashboard/components/flow-graph-area/FlowGraphArea.tsx';
import LatencyGraphArea from '@/pages/dashboard/components/latency-graph-area/LatencyGrahpArea.tsx';
import TableArea from '@/pages/dashboard/components/table-area/TableArea.tsx';

interface MainContentProps {
  scenarioTestResult: ScenarioTestDetailResponse | null;
  className: string;
}

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
