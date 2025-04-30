import styles from './LatencyGraphArea.module.scss';

interface LatencyGraphAreaProps {}

const LatencyGraphArea: React.FC<LatencyGraphAreaProps> = () => {
  return (
    <div className={styles.latencyGraphArea}>
      <h4> Latency </h4>
      <div className={styles.graphArea}></div>
    </div>
  );
};

export default LatencyGraphArea;
