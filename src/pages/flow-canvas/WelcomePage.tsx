// pages/flow-canvas/WelcomePage.tsx
import React from 'react';
import styles from './styles/WelcomePage.module.scss';
import { useDispatch } from 'react-redux';
import { selectScenario, setScenarioList } from '@/store/slices/scenarioSlice';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import { exportScenario } from '@/pages/flow-canvas/service/scenarioService';
import { getScenarioList } from '@/pages/flow-canvas/service/scenarioService';
import { useScenario } from './hooks/useScenario';

const WelcomePage: React.FC = () => {
  const { createScenario } = useScenario();

  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1 className={styles.title}>API Ghost</h1>
      </div>
      <div className={styles.middle}>
        <button className={styles.createButton} onClick={createScenario}>
          Create New Scenario File
        </button>
      </div>
      <div className={styles.bottom} />
    </div>
  );
};

export default WelcomePage;
