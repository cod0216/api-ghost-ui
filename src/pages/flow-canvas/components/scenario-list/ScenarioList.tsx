/**
 * @fileoverview ScenarioList.tsx
 *
 * ScenarioList provides a static list of user-defined scenarios that can be selected
 * for visualization on the FlowCanvas. Each list item can invoke a callback when clicked.
 */
import React, { useEffect, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/ScenarioList.module.scss';
import { useDispatch } from 'react-redux';
import { selectScenario } from '@/store/slices/scenarioSlice';
import { getScenarioInfo } from '@/pages/flow-canvas/service/scenarioService';

/**
 * Displays a static list of user scenarios for selection.
 *
 */
interface ScenarioListProps {
  scenarios: string[];
  selectedScenario: string;
  onSelect: (fileName: string) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, selectedScenario, onSelect }) => {
  return (
    <ul className={styles.list}>
      {scenarios.map(fileName => {
        const isSelected = fileName === selectedScenario;
        return (
          <li
            key={fileName}
            title={fileName}
            onClick={() => onSelect(fileName)}
            className={`${styles.item} ${isSelected ? styles.selectedScenarioFile : ''}`}
          >
            {fileName}
          </li>
        );
      })}
    </ul>
  );
};

export default ScenarioList;
