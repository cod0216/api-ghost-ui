/**
 * @fileoverview ApiList.tsx
 *
 * Renders a list of available API endpoints for dragging onto the FlowCanvas.
 * Each list item is draggable and provides endpoint metadata via drag event.
 */

import React from 'react';
import styles from '@/pages/flow-canvas/styles/ApiList.module.scss';
import { mockEndpoints } from '../../__mocks__/mockNodeData.ts';

/**
 * ApiList component
 *
 *  @returns Renders a list of endpoints available for dragging onto the flow canvas.
 */
const ApiList: React.FC = () => (
  <ul className={styles.list}>
    {mockEndpoints.map(ep => (
      <li
        key={ep.id}
        className={styles.item}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('application/reactflow', JSON.stringify(ep));
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <span className={styles.method}>{ep.method}</span> {ep.path}
      </li>
    ))}
  </ul>
);

export default ApiList;
