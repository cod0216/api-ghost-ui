import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import NodeBody from '@/pages/flow-canvas/components/custom-node/NodeBody';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { MainTabType, SubTabType, NodeEndPoint, Field } from '@/pages/flow-canvas/types';
import { useSchemaEditor } from '@/pages/flow-canvas/hooks/useSchemaEditor';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setNodeTab } from '@/store/slices/nodeTabSlice';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';

const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id, data, xPos, yPos, type }) => {
  const { updateNode, setNodes } = useFlowCanvas();
  const dispatch = useAppDispatch();
  const {
    baseUrl,
    method,
    path,
    showBody,
    requestSchema: dataReq = [],
    responseSchema: dataRes = [],
    header: dataHeader,
  } = data;

  const { requestSchema, responseSchema, save } = useSchemaEditor(id, dataReq, dataRes);

  const savedTab = useAppSelector(state => state.nodeTab[id]) ?? {
    mainTab: MainTabType.REQUEST,
    subTab: SubTabType.BODY,
  };

  const handleToggleBody = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setNodes(nodes =>
      nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, showBody: !showBody } } : n)),
    );
  };

  const handleSave = (
    request: Field[],
    response: Field[],
    updatedHeader?: Record<string, string>,
  ) => {
    save(MainTabType.REQUEST, request);
    save(MainTabType.REQUEST, response);

    const updatedNode = {
      id,
      type: 'endpointNode',
      position: { x: xPos, y: yPos },
      data: {
        ...data,
        requestSchema: request,
        responseSchema: response,
        header: updatedHeader,
        showBody: false,
      },
    };

    updateNode(updatedNode);
  };

  const isMockNode = type === 'mockNode';
  return (
    <div className={styles.nodeWrapper}>
      <div className={`${styles.node} ${styles[method]}`}>
        <div className={`${styles.header} ${isMockNode && styles.mockHeader}`}>{baseUrl}</div>

        <div
          className={styles.actions}
          onClick={e => {
            e.stopPropagation();
            handleToggleBody();
          }}
        >
          <div className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</div>
          <span className={styles.path}>{path}</span>
          <div className={styles.menuIcon}>
            <span className={styles.line} />
            <span className={styles.line} />
            <span className={styles.line} />
          </div>
        </div>

        {showBody && (
          <NodeBody
            requestSchema={requestSchema}
            responseSchema={responseSchema}
            initialMainTabLabel={savedTab.mainTab}
            initialSubTabLabel={savedTab.subTab}
            onTabChange={(main, sub) =>
              dispatch(setNodeTab({ nodeId: id, mainTab: main, subTab: sub }))
            }
            onSaveData={handleSave}
            onClose={handleToggleBody}
            header={dataHeader}
          />
        )}
      </div>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default CustomNode;
