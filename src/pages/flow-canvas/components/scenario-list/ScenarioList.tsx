/**
 * @fileoverview ScenarioList.tsx
 *
 * ScenarioList provides a static list of user-defined scenarios that can be selected
 * for visualization on the FlowCanvas. Each list item can invoke a callback when clicked.
 */
import React from 'react';
import styles from '@/pages/flow-canvas/styles/ScenarioList.module.scss';

interface ScenarioListProps {
  scenarios?: { id: string; name: string }[];
  onSelect?: (id: string) => void;
}
/**
 * Displays a static list of user scenarios for selection.
 *
 * @param onSelect - Handler invoked with the ID of the clicked scenario.
 */
const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios = [], onSelect }) => (
  <ul className={styles.list}>
    {scenarios.map(s => (
      <li key={s.id} onClick={() => onSelect?.(s.id)} className={styles.item}>
        {s.name}
      </li>
    ))}
  </ul>
);

export default ScenarioList;
