/**
 * @fileoverview FlowGraphArea component displays the graph area for the flow visualization.
 *
 * This component renders a section titled "Flow" along with a container
 * (`graphArea`) where a graphical element (such as a chart or flow diagram) can be displayed.
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering the flow graph area.
 */
import { ResultItem } from '@/common/types/HistoryItem.ts';
import styles from '@/pages/dashboard/styles/FlowGraphArea.module.scss';
import { ReactFlowProvider } from 'reactflow';
import ApiTestFlowGraph from '@/pages/dashboard/components/flow-graph-area/FlowGraphCanvas.tsx';

interface FlowGraphAreaProps {
  results: ResultItem[];
}

const FlowGraphArea: React.FC<FlowGraphAreaProps> = ({ results }) => {
  return (
    <div className={styles.flowGraphArea}>
      <h4>Flow</h4>
      <div className={styles.graphArea}>
        <ReactFlowProvider>
          <ApiTestFlowGraph apiResults={results} />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowGraphArea;
