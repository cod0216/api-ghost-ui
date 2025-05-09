/**
 * @fileoverview ScenarioList.tsx
 *
 * ScenarioList provides a static list of user-defined scenarios that can be selected
 * for visualization on the FlowCanvas. Each list item can invoke a callback when clicked.
 */
import React, { useEffect, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/ScenarioList.module.scss';
import { getScenarioList, getScenarioInfo } from '@/pages/flow-canvas/service/scenarioService';
import { ScenarioInfo } from '@/pages/flow-canvas/types/index.ts';

/**
 * Displays a static list of user scenarios for selection.
 *
 */
const ScenarioList: React.FC = () => {
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioInfo | null>(null);

  useEffect(() => {
    getScenarioList()
      .then(setScenarios)
      .catch(err => console.error('[ScenarioList] getScenarioList Error', err));
  }, []);

  const onSelect = async (fileName: string) => {
    await getScenarioInfo(fileName)
      .then(setSelectedScenario)
      .catch(err => console.error('[ScenarioList] getScenarioInfo Error', err));
  };

  useEffect(() => {
    console.log(selectedScenario);
  }, [selectedScenario]);

  return (
    <ul className={styles.list}>
      {scenarios.map(fileName => (
        <li key={fileName} onClick={() => onSelect(fileName)} className={styles.item}>
          {fileName}
        </li>
      ))}
    </ul>
  );
};

export default ScenarioList;
