/**
 * @fileoverview FlowGraphArea component displays the graph area for the flow visualization.
 *
 * This component renders a section titled "Flow" along with a container
 * (`graphArea`) where a graphical element (such as a chart or flow diagram) can be displayed.
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering the flow graph area.
 */
import styles from './FlowGraphArea.module.scss';

interface FlowGraphAreaProps {}

const FlowGraphArea: React.FC<FlowGraphAreaProps> = () => {
  return (
    <div className={styles.flowGraphArea}>
      <h4>Flow</h4>
      <div className={styles.graphArea}></div>
    </div>
  );
};

export default FlowGraphArea;
