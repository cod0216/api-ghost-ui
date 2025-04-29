import React from 'react';
import styles from './FlowCanvas.module.scss';
import Sidebar from './SideBar/SideBar.tsx';

export interface FlowCanvasProps {}
/**
 * Displays the interface for drawing scenario flows and visualizing the connections between endpoints
 *
 * @returns flow display
 */
const FlowCanvas = () => {
  return (
    <div className={styles.container}>
      <div>
        <Sidebar />
      </div>
      <div className={styles.canvas}>Flow Canvas</div>
    </div>
  );
};
export default FlowCanvas;
