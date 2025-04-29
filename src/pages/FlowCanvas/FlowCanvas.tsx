import React from 'react';
import styles from './FlowCanvas.module.scss';

export interface FlowCanvasProps {}
/**
 * Displays the interface for drawing scenario flows and visualizing the connections between endpoints
 *
 * @returns flow display
 */
const FlowCanvas: React.FC<FlowCanvasProps> = () => {
  return <div className={styles.canvas}>Flow Canvas</div>;
};

export default FlowCanvas;
