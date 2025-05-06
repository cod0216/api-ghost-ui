/**
 * @fileoverview FlowGraphArea component displays the graph area for the flow visualization.
 *
 * This component renders a section titled "Flow" along with a container
 * (`graphArea`) where a graphical element (such as a chart or flow diagram) can be displayed.
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering the flow graph area.
 */
import React from 'react';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';
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
