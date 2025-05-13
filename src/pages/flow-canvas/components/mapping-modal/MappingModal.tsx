import React, { useEffect, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import MappingPanel from './MappingPanel';
import { KeyValue, MappingPair, MappingData } from '@/pages/flow-canvas/types/index.ts';
import { CommonButton } from '@/common/components/CommonButton';
import { useMappingModal } from '@/pages/flow-canvas/hooks/useMappingModal';
import type { Node, Edge } from 'reactflow';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import { parseJsonToFields, fieldsToJson } from '@/common/utils/JsonUtils';
import {} from '@/pages/flow-canvas/hooks/useMappingModal';
import { flattenSchema } from '@/common/utils/schemaUtils';
import { useMappingSelection } from '@/pages/flow-canvas/hooks/useMappingSelection';
import { NodeEndPoint } from '@/pages/flow-canvas/types/index.ts';

interface MappingModalProps {
  closeModal: () => void;
  edge: Edge;
  nodes: Node<NodeEndPoint>[];
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
}
export const MappingModal: React.FC<MappingModalProps> = ({
  closeModal,
  edge,
  nodes,
  setEdges,
}) => {
  const mappingInfo: MappingPair[] = (edge.data as any)?.mappingInfo ?? [];

  // const { nodes, setEdges } = useFlowCanvas();
  const panelLabels = ['Response', 'Request'];
  const {
    leftSelectedKey,
    rightSelectedKeys,
    setLeftSelectedKey,
    setRightSelectedKeys,
    setRightSelectedKey,
  } = useMappingModal();

  const leftNode = nodes.find(n => n.id === edge.source)!;
  const rightNode = nodes.find(n => n.id === edge.target)!;
  let parsedData = null;
  if (leftNode.data.responseSchema) parsedData = flattenSchema(leftNode.data.responseSchema);

  const [leftData, setLeftDate] = useState<MappingData>({
    valueList: parsedData,
    title: leftNode.data.path,
    baseURl: leftNode.data.baseUrl,
    path: leftNode.data.path,
    method: leftNode.data.method,
  });

  parsedData = null;
  if (rightNode.data.responseSchema) parsedData = flattenSchema(rightNode.data.responseSchema);

  const [rightData, setRightDate] = useState<MappingData>({
    valueList: parsedData,
    title: rightNode.data.path,
    baseURl: rightNode.data.baseUrl,
    path: rightNode.data.path,
    method: rightNode.data.method,
  });

  useEffect(() => {
    if (mappingInfo.length) {
      const first = mappingInfo[0].sourceKey;
      setLeftSelectedKey(first);
      const targets = mappingInfo.filter(p => p.sourceKey === first).map(p => p.targetKey);
      setRightSelectedKeys(targets);
    } else {
      setLeftSelectedKey(null);
      setRightSelectedKeys([]);
    }
  }, [edge.id]);
  const toggleLeftKey = (key: string) => {
    setLeftSelectedKey(key);
    const targets = mappingInfo.filter(p => p.sourceKey === key).map(p => p.targetKey);
    setRightSelectedKeys(targets);
  };

  const toggleRightKey = (key: string) => {
    setRightSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleConfirmMapping = () => {
    if (!leftSelectedKey) return;
    const newPairs: MappingPair[] = rightSelectedKeys.map(rk => ({
      sourceKey: leftSelectedKey,
      targetKey: rk,
    }));
    // console.log('[MappingModal] newPairs to save →', newPairs);
    setEdges(es =>
      es.map(e =>
        e.id === edge.id
          ? {
              ...e,
              data: {
                ...(e.data ?? {}),
                mappingInfo: newPairs,
              },
            }
          : e,
      ),
    );
    closeModal();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>"MappingModal"</h2>
        </div>
        <div className={styles.mappingPanel}>
          <MappingPanel
            label={panelLabels[0]}
            mappingData={leftData}
            selectedKeys={leftSelectedKey ? [leftSelectedKey] : []}
            onToggleKey={toggleLeftKey}
            singleSelect={true}
          />

          <MappingPanel
            label={panelLabels[1]}
            mappingData={rightData}
            selectedKeys={rightSelectedKeys}
            onToggleKey={toggleRightKey}
            singleSelect={true}
          />
        </div>
        <CommonButton onConfirm={handleConfirmMapping} onCancel={closeModal} />
      </div>
    </div>
  );
};
