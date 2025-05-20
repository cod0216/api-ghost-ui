import React, { useRef } from 'react';
import { ScenarioTestDetailResponse } from '@/pages/dashboard/types/index.ts';
import styles from '@/pages/dashboard/styles/MainContent.module.scss';
import FlowGraphArea from '@/pages/dashboard/components/flow-graph-area/FlowGraphArea.tsx';
import LatencyGraphArea from '@/pages/dashboard/components/latency-graph-area/LatencyGrahpArea.tsx';
import TableArea from '@/pages/dashboard/components/table-area/TableArea';
import { useReactToPrint } from 'react-to-print';
import pdf from '@/assets/icons/pdf.svg';

interface MainContentProps {
  scenarioTestResult: ScenarioTestDetailResponse | null;
  className: string;
}

const MainContent: React.FC<MainContentProps> = ({ scenarioTestResult, className }) => {
  if (!scenarioTestResult) return <div className={`${styles.emptyContent} ${className}`}></div>;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className={className} ref={componentRef}>
      <div className={styles.historyInfo}>
        <div>
          <h2>{scenarioTestResult.name}</h2>
          <p>{scenarioTestResult.description}</p>
        </div>

        <div className={styles.meta}>
          <div>{new Date(scenarioTestResult.executedAt).toLocaleString()}</div>
          <div>Success: {scenarioTestResult.isScenarioSuccess ? '✅' : '❌'}</div>
          <div onClick={handlePrint}>
            <img src={pdf} alt="pdf export" width={24} height={24} />
          </div>
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
