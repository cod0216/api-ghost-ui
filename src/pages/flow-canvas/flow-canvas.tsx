import React from 'react';
import styles from './flow-canvas.module.scss';
import Sidebar from './side-bar/side-bar.tsx';

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
