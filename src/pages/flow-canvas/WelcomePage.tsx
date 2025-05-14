// pages/flow-canvas/WelcomePage.tsx
import React from 'react';
import styles from './styles/WelcomePage.module.scss';
import { useDispatch } from 'react-redux';
import { selectScenario, setScenarioList } from '@/store/slices/scenarioSlice';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import { exportScenario } from '@/pages/flow-canvas/service/scenarioService';
import { getScenarioList } from '@/pages/flow-canvas/service/scenarioService';

const WelcomePage: React.FC = () => {
  const dispatch = useDispatch();

  const onCreate = async () => {
    const name = prompt('Input Scenario file name');
    if (!name) return;

    const newScenario: ScenarioInfo = {
      name,
      description: '',
      timeoutMs: 0,
      store: null,
      steps: {},
    };

    dispatch(selectScenario(newScenario));

    const resp = await exportScenario(newScenario);
    if (!resp.status) {
      alert('Scenario file save is fail');
    }
    const list = await getScenarioList();
    dispatch(setScenarioList(list));
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1 className={styles.title}>API Ghost</h1>
      </div>
      <div className={styles.middle}>
        <button className={styles.createButton} onClick={onCreate}>
          Create New Scenario File
        </button>
      </div>
      <div className={styles.bottom} />
    </div>
  );
};

export default WelcomePage;
