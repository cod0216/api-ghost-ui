/**
 * @fileoverview ApiList.tsx
 *
 * Renders a list of available API endpoints for dragging onto the FlowCanvas.
 * Each list item is draggable and provides endpoint metadata via drag event.
 */

import React from 'react';
import styles from '@/pages/flow-canvas/styles/ApiList.module.scss';
import { mockApi } from '../../__mocks__/mockNodeData.ts';
import { ApiEndpoint, NodeEndPoint } from '@/common/types/NodeEndPoint.ts';
import { nanoid } from 'nanoid';
/**
 * ApiList component
 *
 *  @returns Renders a list of endpoints available for dragging onto the flow canvas.
 */

const toNodeEndPoint = (ep: ApiEndpoint): NodeEndPoint => ({
  endpointId: nanoid(),
  method: ep.httpMethod,
  path: ep.path,
  baseUrl: ep.baseUrl,
  requestSchema: ep.requestSchema ?? [],
  responseSchema: ep.responseSchema ?? [],
  showBody: false,
});

const ApiList: React.FC = () => {
  return (
    <ul className={styles.list}>
      {mockApi.map(api => {
        const spec = toNodeEndPoint(api);
        return (
          <li
            key={spec.endpointId}
            className={styles.item}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('application/json', JSON.stringify(spec));
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <span className={styles[`${spec.method}Method`]}>{spec.method}</span> {spec.path}
          </li>
        );
      })}
    </ul>
  );
};

export default ApiList;
