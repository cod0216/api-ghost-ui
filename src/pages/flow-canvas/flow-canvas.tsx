import React from 'react';
import styles from './flow-canvas.module.scss';
import SideBar from './side-bar/side-bar.tsx';

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
        <SideBar />
      </div>
      <div className={styles.canvas}>Flow Canvas</div>
    </div>
  );
};
export default FlowCanvas;
