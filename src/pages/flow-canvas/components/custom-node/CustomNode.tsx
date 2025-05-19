import React, { useEffect, MouseEvent, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import NodeBody from '@/pages/flow-canvas/components/custom-node/NodeBody';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { MainTabType, SubTabType, NodeEndPoint } from '@/pages/flow-canvas/types';
import { useSchemaEditor } from '@/pages/flow-canvas/hooks/useSchemaEditor';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setNodeTab } from '@/store/slices/nodeTabSlice';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import { useNodeControls } from '@/pages/flow-canvas/hooks/useCustomNode';

const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id, data, xPos, yPos, type }) => {
  const { updateNode, setNodes } = useFlowCanvas();
  const dispatch = useAppDispatch();
  const { savePath } = useNodeControls(id);
  const {
    baseUrl,
    method,
    path: initialPath,
    showBody,
    requestSchema: dataReq = '{}',
    responseSchema: dataRes = '{}',
    header: dataHeader = '',
  } = data;

  const { requestSchema, responseSchema, save } = useSchemaEditor(id, dataReq, dataRes);

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [tempPath, setTempPath] = useState(initialPath);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempPath(initialPath);
  }, [initialPath]);

  useEffect(() => {
    if (isEditingPath && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingPath]);

  const handleDoubleClickPath = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditingPath(true);
  };

  const handlePathBlur = () => {
    const newPath = tempPath.trim();
    savePath(newPath);
    setIsEditingPath(false);
  };

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

  const handleSave = (request: string, response: string, updatedHeader?: string) => {
    save(MainTabType.REQUEST, request);
    save(MainTabType.RESPONSE, response);

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
      } as NodeEndPoint,
    };
    updateNode(updatedNode);
  };

  const isMockNode = type === 'mockNode';
  return (
    <div className={styles.nodeWrapper}>
      <div className={`${styles.node} ${styles[method]}`}>
        <div className={`${styles.header} ${isMockNode && styles.mockHeader}`}>{baseUrl}</div>

        <div className={styles.actions}>
          <div className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</div>
          {isEditingPath ? (
            <input
              ref={inputRef}
              type="text"
              className={styles.pathInput}
              value={tempPath}
              onChange={e => setTempPath(e.target.value)}
              onBlur={handlePathBlur}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handlePathBlur();
                }
              }}
            />
          ) : (
            <span className={styles.path} onDoubleClick={handleDoubleClickPath}>
              {initialPath}
            </span>
          )}
          <div
            className={styles.menuIcon}
            onClick={e => {
              e.stopPropagation();
              handleToggleBody();
            }}
          >
            <span className={styles.line} />
            <span className={styles.line} />
            <span className={styles.line} />
          </div>
        </div>

        {showBody && (
          <NodeBody
            requestSchema={requestSchema as string}
            responseSchema={responseSchema as string}
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
