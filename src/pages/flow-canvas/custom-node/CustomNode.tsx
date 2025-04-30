/**
 * @fileoverview
 *
 */

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
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
const CustomNode: React.FC<NodeProps<FlowNodeData>> = ({ data }) => {
  const { baseUrl, method, path, showBody, body } = data;
  const upperMethod = method.toUpperCase();
  const hasBody = ['post', 'put', 'patch'].includes(method.toLowerCase());
  return (
    <div className={`${styles.node} ${styles[method]}`}>
      {<div className={styles.header}>{baseUrl}</div>}
      <div className={styles.actions}>
        <div className={`${styles.methodBtn} ${styles[`${method}Method`]}`}>{upperMethod}</div>
        <span className={styles.path}>{path}</span>
        <div className={styles.menuIcon}>
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </div>
      </div>

      {hasBody && showBody && (
        <pre className={`${styles.body} ${styles.bodySection}`}>
          {JSON.stringify(body, null, 2)}
        </pre>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
