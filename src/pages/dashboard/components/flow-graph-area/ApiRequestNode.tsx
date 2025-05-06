import React from 'react';
import { Handle, Position } from 'reactflow';
import styles from '@/pages/dashboard/styles/ApiRequestNode.module.scss';
import { ApiRequestData, NodeStatus } from '@/pages/dashboard/types/index.ts';
import { getNodeStatusClass } from '@/pages/dashboard/utils/rechartUtils.ts';

interface ApiRequestNodeProps {
  data: ApiRequestData;
  isConnectable: boolean;
}

const nodeStatusClassMap: Record<NodeStatus, string> = {
  [NodeStatus.Success]: styles.success,
  [NodeStatus.Error]: styles.error,
  [NodeStatus.Unreachable]: styles.unreachable,
};

const ApiRequestNode: React.FC<ApiRequestNodeProps> = ({ data, isConnectable }) => {
  const statusClass = getNodeStatusClass(data);
  const statusClassName = nodeStatusClassMap[statusClass];

  return (
    <div className={`${styles.apiRequestNode} ${statusClassName}`}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className={styles.handle}
      />

      <div className={styles.header}>
        <div className={styles.method}>{data.method}</div>
        <div className={styles.endpoint}>{data.url}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.statusRow}>
          <span className={styles.statusCode}>Status: {data.statusCode}</span>
          <span className={styles.duration}>{data.durationMs}ms</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className={styles.handle}
      />
    </div>
  );
};

export default ApiRequestNode;
