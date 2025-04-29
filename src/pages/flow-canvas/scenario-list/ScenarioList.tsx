/**
 * @fileoverview ScenarioList.tsx
 *
 * ScenarioList provides a static list of user-defined scenarios that can be selected
 * for visualization on the FlowCanvas. Each list item can invoke a callback when clicked.
 */

import styles from '@/pages/flow-canvas/scenario-list/ScenarioList.module.scss';

/**
 * Displays a static list of user scenarios for selection.
 *
 * @param onSelect - Handler invoked with the ID of the clicked scenario.
 */
const ScenarioList = () => {
  return <ul className={styles.list}>{}</ul>;
};

export default ScenarioList;
