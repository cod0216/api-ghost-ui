/**
 * @fileoverview
 *
 */

import React, { MouseEvent, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import BodyEditor from '@/pages/flow-canvas/custom-node/BodyEditor.tsx';
import styles from './CustomNode.module.scss';

type FlowNodeData = {
  baseUrl: string;
  method: string;
  path: string;
  showBody?: boolean;
  body?: any;
};

/**
 *
 * @param param0
 * @returns
 */
const CustomNode: React.FC<NodeProps<FlowNodeData>> = ({ id, data }) => {
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
        <div className={`${styles.methodBtn} ${styles[`${method}Method`]}`}>{upperMethod}</div>
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
