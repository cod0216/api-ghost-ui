import styles from './FlowGraphArea.module.scss';

interface FlowGraphAreaProps {}

const FlowGraphArea: React.FC<FlowGraphAreaProps> = () => {
  return (
    <div className={styles.flowGraphArea}>
      <h4> Flow</h4>
      <div className={styles.graphArea}></div>
    </div>
  );
};

export default FlowGraphArea;
