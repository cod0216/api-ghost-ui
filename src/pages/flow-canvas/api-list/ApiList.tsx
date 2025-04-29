/**
 * @fileoverview ApiList.tsx
 *
 * Renders a list of available API endpoints for dragging onto the FlowCanvas.
 * Each list item is draggable and provides endpoint metadata via drag event.
 */

import React from 'react';
import styles from '@/pages/flow-canvas/api-list/ApiList.module.scss';
import { mockEndpoints, Endpoint } from '@/pages/flow-canvas/data/endpoint.ts';

/**
 * Renders a list of endpoints available for dragging onto the flow canvas.
 */
const ApiList: React.FC = () => {
  /**
   * Handles the drag start event for an endpoint list item.
   * Sets the drag data to include endpoint details for FlowCanvas.
   *
   * @param event - React drag event from the list item
   * @param endpoint - Endpoint data being dragged
   */
  const onDragStart = (event: React.DragEvent<HTMLLIElement>, endpoint: Endpoint) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(endpoint));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <ul className={styles.list}>
      {mockEndpoints.map(endpoint => (
        <li
          key={endpoint.id}
          className={styles.item}
          draggable
          onDragStart={e => onDragStart(e, endpoint)}
        >
          <span className={styles.method}>{endpoint.method}</span> {endpoint.path}
        </li>
      ))}
    </ul>
  );
};

export default ApiList;
