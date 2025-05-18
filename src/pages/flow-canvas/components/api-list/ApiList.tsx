/**
 * @fileoverview ApiList.tsx
 *
 * Renders a list of available API endpoints for dragging onto the FlowCanvas.
 * Each list item is draggable and provides endpoint metadata via drag event.
 */

import React, { useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/ApiList.module.scss';
import { ApiEndpoint, NodeEndPoint } from '@/pages/flow-canvas/types';
import { nanoid } from 'nanoid';
import { getEndpointList } from '@/pages/flow-canvas/service/endPointService';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';

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
  requestSchema: ep.requestSchema ?? '{}',
  responseSchema: ep.responseSchema ?? '{}',
  showBody: false,
});

const ApiList: React.FC = () => {
  const [apiList, setApiList] = useState<ApiEndpoint[]>([]);
  const { onDoubleClick } = useFlowCanvas();
  useEffect(() => {
    getEndpointList()
      .then(setApiList)
      .catch(err => console.error('[ScenarioList] getScenarioList Error', err));
  }, []);

  return (
    <ul className={styles.list}>
      {apiList.map(api => {
        const spec = toNodeEndPoint(api);
        return (
          <li key={spec.endpointId} className={styles.wrapper}>
            <div
              className={styles.item}
              title={`${spec.method} ${spec.path}`}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/json', JSON.stringify(spec));
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDoubleClick={e => onDoubleClick(e, spec)}
            >
              <span className={styles[`${spec.method}Method`]}>{spec.method}</span> {spec.path}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ApiList;
