/**
 * @fileoverview CustomNode.tsx
 *
 * This component defines a custom node used in React Flow.
 * Each node represents an API endpoint with its baseUrl, method, and path.
 * It also supports toggling a body editor for modifying the request body.
 */

import React, { MouseEvent, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import BodyEditor from '@/pages/flow-canvas/components/custom-node/BodyEditor.tsx';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { NodeEndPoint } from '@/common/types/index.ts';

/**
 * CustomNode component
 *
 * @param param0 Props passed by React Flow: node ID and data
 * @returns Rendered node UI component
 */
const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const { baseUrl, method, path, showBody, body } = data;
  const upperMethod = method.toUpperCase();

  const handleToggleBody = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setNodes(nodes =>
        nodes.map(n =>
          n.id === id ? { ...n, data: { ...n.data, showBody: !n.data.showBody } } : n,
        ),
      );
    },
    [id, setNodes],
  );

  const handleSaveBody = useCallback(
    (newBody: any) => {
      setNodes(nodes =>
        nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, body: newBody } } : n)),
      );
    },
    [id, setNodes],
  );

  return (
    <div className={`${styles.node} ${styles[method]}`}>
      <div className={styles.header}>{baseUrl}</div>
      <div className={styles.actions} onClick={handleToggleBody}>
        {' '}
        <div className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{upperMethod}</div>
        <span className={styles.path}>{path}</span>
        <div className={styles.menuIcon}>
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </div>
      </div>

      {showBody && (
        <BodyEditor
          body={body}
          onSave={handleSaveBody}
          onClose={() => handleToggleBody({ stopPropagation: () => {} } as MouseEvent)}
        />
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
