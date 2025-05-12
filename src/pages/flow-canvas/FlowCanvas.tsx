import React, { useEffect, useState } from 'react';
import ReactFlow, { MarkerType, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import { useMappingModal } from '@/pages/flow-canvas/hooks/useMappingModal';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color';
import { flattenSchema } from '@/common/utils/schemaUtils';
import { useMockApiModal } from '@/pages/flow-canvas/hooks/useMockApiModal';
import { MockApiModal } from '@/pages/flow-canvas/components/mock-api-modal/MockApiModal';
import CommonSidebar from '@/common/components/CommonSidebar';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList';
import { useAppSelector } from '@/store/hooks';
import { useReactFlow } from 'reactflow';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
import { NodeEndPoint } from '@/pages/flow-canvas/types';
const nodeTypes = { endpointNode: CustomNode };
type NodeType = Node<NodeEndPoint>;

const FlowCanvas: React.FC = () => {
  const {
    wrapperRef,
    nodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    onEdgeContextMenu,
    addNode,
    removeNode,
    onMove,
  } = useFlowCanvas();

  const {
    isModalVisible,
    leftKeyValueList,
    rightKeyValueList,
    leftEndpointTitle,
    rightEndpointTitle,
    leftEndpointBaseUrl,
    rightEndpointBaseUrl,
    openMappingModal,
    cancelMappingModal,
    leftSelectedKey,
    rightSelectedKey,
  } = useMappingModal();

  const {
    isVisible: isMockVisible,
    formValues,
    baseUrl,
    path,
    method,
    isSchemaValid,
    openMockApiModal,
    closeMockApiModal,
    reqSchemaText,
    resSchemaText,
    setBaseUrl,
    setMethod,
    setPath,
    setIsSchemaValid,
    setReqSchemaText,
    setResSchemaText,
    validateSchemas,
  } = useMockApiModal();
  const [currentEdgeId, setCurrentEdgeId] = useState<string | null>(null);
  const [currentSrc, setCurrentSrc] = useState<NodeType | null>(null);
  const [currentTgt, setCurrentTgt] = useState<NodeType | null>(null);

  const viewport = useAppSelector(state => state.flow.viewport);
  const { setViewport: instSetViewport } = useReactFlow();
  useEffect(() => {
    if (viewport) instSetViewport(viewport, { duration: 0 });
  }, [viewport, instSetViewport]);

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    setCurrentEdgeId(edge.id);
    const srcNode = nodes.find(n => n.id === edge.source)!;
    const tgtNode = nodes.find(n => n.id === edge.target)!;
    setCurrentSrc(srcNode);
    setCurrentTgt(tgtNode);

    const respList = flattenSchema(srcNode.data.responseSchema ?? []);
    const reqList = flattenSchema(tgtNode.data.requestSchema ?? []);
    const titleLeft = `${srcNode.data.method} ${srcNode.data.path}`;
    const titleRight = `${tgtNode.data.method} ${tgtNode.data.path}`;
    const existing: MappingPair[] = (edge.data as any)?.mappingInfo ?? [];
    openMappingModal(
      respList,
      reqList,
      titleLeft,
      titleRight,
      srcNode.data.baseUrl,
      tgtNode.data.baseUrl,
      existing,
    );
  };

  const handleConfirmMapping = (pairs: MappingPair[]) => {
    if (!currentEdgeId) return;
    setEdges(es =>
      es.map(e =>
        e.id === currentEdgeId ? { ...e, data: { ...(e.data ?? {}), mappingInfo: pairs } } : e,
      ),
    );
    cancelMappingModal();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    openMockApiModal(e.clientX - bounds.left, e.clientY - bounds.top);
  };

  return (
    <div className={styles.container}>
      <CommonSidebar
        sections={[
          { title: 'API List', content: <ApiList /> },
          { title: 'Scenario List', content: <ScenarioList /> },
        ]}
      />
      <div className={styles.canvas} ref={wrapperRef} onContextMenu={handleContextMenu}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={(event, node) => {
            event.preventDefault();
            event.stopPropagation();
            removeNode(node.id);
          }}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onEdgeContextMenu={onEdgeContextMenu}
          onDragOver={onDragOver}
          onDrop={onDrop}
          defaultViewport={viewport}
          onMove={onMove}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.allow },
          }}
        />
        <MappingModal
          isVisible={isModalVisible}
          modalTitle="Field Mapping"
          panelLabels={['Response', 'Request']}
          leftEndpointTitle={leftEndpointTitle}
          rightEndpointTitle={rightEndpointTitle}
          leftKeyValueList={leftKeyValueList}
          rightKeyValueList={rightKeyValueList}
          leftEndpointBaseUrl={leftEndpointBaseUrl}
          rightEndpointBaseUrl={rightEndpointBaseUrl}
          leftSelectedKey={leftSelectedKey}
          rightSelectedKey={rightSelectedKey}
          onConfirm={handleConfirmMapping}
          onDismiss={cancelMappingModal}
        />

        <MockApiModal
          isVisible={isMockVisible}
          formValues={formValues}
          baseUrl={baseUrl}
          path={path}
          method={method}
          isSchemaValid={isSchemaValid}
          reqSchemaText={reqSchemaText}
          resSchemaText={resSchemaText}
          setBaseUrl={setBaseUrl}
          setMethod={setMethod}
          setPath={setPath}
          setIsSchemaValid={setIsSchemaValid}
          setReqSchemaText={setReqSchemaText}
          setResSchemaText={setResSchemaText}
          onConfirm={addNode}
          onCancel={closeMockApiModal}
          validateSchemas={validateSchemas}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
