import React, { useState } from 'react';
import styles from '@/pages/loadtest/styles/LoadTest.module.scss';
import playIcon from '@/assets/icons/play.svg';
import { LoadTestParamInfo } from '@/pages/loadtest/types';
import ChartArea from './ChartArea';
import buttonStyles from '@/common/components/SaveButton.module.scss';

interface LoadTestInfoProps {
  loadTest: LoadTestParamInfo | null;
}

const LoadTestInfo: React.FC<LoadTestInfoProps> = ({ loadTest }) => {
  const [onTest, setOnTest] = useState<boolean>(false);

  const handleSelectExcute = () => {
    if (!loadTest) return;
    setOnTest(true);
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.loadTestInfo}>
        <div>
          <h2>{loadTest?.name}</h2>
          <p>{loadTest?.description}</p>
        </div>
        <button className={buttonStyles.container} onClick={handleSelectExcute}>
          <img src={playIcon} alt="excute loadtest" width={24} height={24} />
        </button>
      </div>

      <ChartArea loadTest={loadTest} onTest={onTest} closeTest={() => setOnTest(false)} />
    </div>
  );
};

export default LoadTestInfo;
