import React from 'react';
import { ReactFlow, MarkerType, Handle, Position, NodeProps, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import SideBar from '@/common/side-bar/Sidebar.tsx';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas.ts';
import { useMappingModal } from '@/pages/flow-canvas/hooks/useMappingModal';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode.tsx';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal.tsx';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color.ts';
import { flattenSchema } from '@/common/utils/schemaUtils';

const nodeTypes = { endpointNode: CustomNode };

const FlowCanvas: React.FC = () => {
  const {
    wrapperRef,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    onEdgeContextMenu,
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
    saveMappingModal,
    cancelMappingModal,
  } = useMappingModal();

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    openMappingModal(
      sourceNode ? flattenSchema(sourceNode.data.responseSchema) : [],
      targetNode ? flattenSchema(targetNode.data.requestSchema) : [],
      sourceNode ? `${sourceNode.data.method} ${sourceNode.data.path}` : '',
      targetNode ? `${targetNode.data.method} ${targetNode.data.path}` : '',
      sourceNode?.data.baseUrl ?? '',
      targetNode?.data.baseUrl ?? '',
    );
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.canvas} ref={wrapperRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onEdgeContextMenu={onEdgeContextMenu}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.allow },
          }}
        />
        <MappingModal
          isVisible={isModalVisible}
          leftEndpointTitle={leftEndpointTitle}
          rightEndpointTitle={rightEndpointTitle}
          leftKeyValueList={leftKeyValueList}
          rightKeyValueList={rightKeyValueList}
          leftEndpointBaseUrl={leftEndpointBaseUrl}
          rightEndpointBaseUrl={rightEndpointBaseUrl}
          onConfirm={saveMappingModal}
          onDismiss={cancelMappingModal}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
