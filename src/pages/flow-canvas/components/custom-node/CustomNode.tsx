import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import BodyEditor from '@/pages/flow-canvas/components/custom-node/BodyEditor';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { MainTabType, SubTabType, NodeEndPoint, Field } from '@/pages/flow-canvas/types';
import { useSchemaEditor } from '@/pages/flow-canvas/hooks/useSchemaEditor';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setNodeTab } from '@/store/slices/nodeTabSlice';

const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id, data, xPos, yPos }) => {
  const { setNodes } = useReactFlow();
  const dispatch = useAppDispatch();
  const {
    baseUrl,
    method,
    path,
    showBody,
    requestSchema: dataReq = [],
    responseSchema: dataRes = [],
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

  const handleSave = (type: MainTabType, newSchema: Field[]) => {
    save(type, newSchema);

    setNodes(nodes =>
      nodes.map(n =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                requestSchema: type === MainTabType.REQUEST ? newSchema : n.data.requestSchema,
                responseSchema: type === MainTabType.RESPONSE ? newSchema : n.data.responseSchema,
                showBody: false,
              },
            }
          : n,
      ),
    );
  };
  const handleSaveRequest = (schema: Field[]) => handleSave(MainTabType.REQUEST, schema);
  const handleSaveResponse = (schema: Field[]) => handleSave(MainTabType.RESPONSE, schema);

  return (
    <div className={`${styles.node} ${styles[method]}`}>
      <div className={styles.header}>{baseUrl}</div>

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
        <BodyEditor
          requestSchema={requestSchema}
          responseSchema={responseSchema}
          initialMainTabLabel={savedTab.mainTab}
          initialSubTabLabel={savedTab.subTab}
          onTabChange={(main, sub) =>
            dispatch(setNodeTab({ nodeId: id, mainTab: main, subTab: sub }))
          }
          onSaveRequestSchema={handleSaveRequest}
          onSaveResponseSchema={handleSaveResponse}
          onClose={handleToggleBody}
        />
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
