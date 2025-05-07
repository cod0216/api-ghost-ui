/**
 * @fileoverview CustomNode.tsx
 *
 * This component defines a custom node used in React Flow.
 * Each node represents an API endpoint with its baseUrl, method, and path.
 * It also supports toggling a body editor for modifying the request body.
 */

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import BodyEditor from '@/pages/flow-canvas/components/custom-node/BodyEditor.tsx';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { NodeEndPoint, Field } from '@/common/types/index.ts';
import { useNodeControls } from '@/pages/flow-canvas/hooks/useCustomNode.ts';

/**
 * CustomNode component
 *
 * @param param0 Props passed by React Flow: node ID and data
 * @returns Rendered node UI component
 */

const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id, data }) => {
  const { baseUrl, method, path, showBody, requestSchema, responseSchema } = data;
  const { toggleBody, saveRequestSchema } = useNodeControls(id);

  return (
    <div className={`${styles.node} ${styles[method]}`}>
      <div className={styles.header}>{baseUrl}</div>
      <div className={styles.actions} onClick={toggleBody}>
        <div className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</div>
        <span className={styles.path}>{path}</span>
        <div className={styles.menuIcon}>
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </div>
      </div>

      {showBody && (
        <>
          <BodyEditor
            requestSchema={requestSchema ?? []}
            responseSchema={responseSchema ?? []}
            onSave={saveRequestSchema}
            onClose={() => toggleBody()}
          />
        </>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
