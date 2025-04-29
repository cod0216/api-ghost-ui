import React from 'react';
import styles from './api-list.module.scss';
import { mockEndpoints, Endpoint } from '@/pages/flow-canvas/data/endpoint.ts';

/**
 * Renders a list of endpoints available for dragging onto the flow canvas.
 */
const ApiList: React.FC = () => {
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
