/**
 * Displays a graphical representation of API test results in a flow format.
 *
 * @param props - Component props containing scenario test results and container styling.
 * @returns A component showing the test flow using a visual graph interface.
 *
 * @author haerim-kweon
 */
import React from 'react';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';
import styles from '@/pages/dashboard/styles/FlowGraphArea.module.scss';
import { ReactFlowProvider } from 'reactflow';
import ApiTestFlowGraph from '@/pages/dashboard/components/flow-graph-area/FlowGraphCanvas.tsx';

interface FlowGraphAreaProps {
  results: ScenarioTestDetailResponseResult[];
  className: string;
}

const FlowGraphArea: React.FC<FlowGraphAreaProps> = ({ results, className }) => {
  return (
    <div className={className}>
      <h4>Flow</h4>
      <div className={styles.graphArea}>
        <ReactFlowProvider>
          <ApiTestFlowGraph results={results} />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowGraphArea;
