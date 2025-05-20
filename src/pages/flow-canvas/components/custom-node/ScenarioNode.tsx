import React, { useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { MainTabType, SubTabType, NodeEndPoint } from '@/pages/flow-canvas/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setNodeTab } from '@/store/slices/nodeTabSlice';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import ScenarioNodeBody from './ScenarioNodeBody';
import { RequestBody } from '@/common/types';
import { useNodeControls } from '@/pages/flow-canvas/hooks/useCustomNode';

const ScenarioNode: React.FC<NodeProps> = ({ id, data, xPos, yPos, type }) => {
  const { updateNode, setNodes } = useFlowCanvas();
  const dispatch = useAppDispatch();
  const { savePath } = useNodeControls(id);

  const {
    baseUrl,
    method,
    path: initialPath,
    showBody,
    requestSchema: dataReq = '',
    responseSchema: dataRes = '',
    header: dataHeader,
    isSuccess: pass = false,
    isFail: nonPass = false,
  } = data;

  const savedTab = useAppSelector(state => state.nodeTab[id]) ?? {
    mainTab: MainTabType.REQUEST,
    subTab: SubTabType.BODY,
  };

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [tempPath, setTempPath] = useState(initialPath);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClickPath = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsEditingPath(true);
  };

  const handlePathBlur = () => {
    const newPath = tempPath.trim();
    savePath(newPath);
    setIsEditingPath(false);
  };

  const handleToggleBody = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setNodes(nodes =>
      nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, showBody: !showBody } } : n)),
    );
  };

  const handleSave = (request: RequestBody, response: string, updatedHeader?: string) => {
    const updatedNode = {
      id,
      type: type,
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

  const isPassStyle = pass === true ? 'success' : '';
  const isFailStyle = nonPass === true ? 'fail' : '';
  return (
    <div className={styles.nodeWrapper}>
      <div className={`${styles.node} ${styles[method]}`}>
        <div
          className={`${styles.header} ${isPassStyle && styles.passHeader} ${isFailStyle && styles.nonPassHeader}`}
        >
          {baseUrl}
        </div>

        <div
          className={`${styles.actions} ${isPassStyle && styles.passBody} ${isFailStyle && styles.nonpassBody} `}
        >
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
          <ScenarioNodeBody
            requestSchema={dataReq}
            responseSchema={dataRes}
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
      <Handle id="target" type="target" position={Position.Left} className={styles.handle} />
      <Handle id="source" type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default ScenarioNode;
