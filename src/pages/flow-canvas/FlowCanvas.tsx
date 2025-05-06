/**
 * @fileoverview FlowCanvas.tsx
 *
 * FlowCanvas provides a UI where users can construct scenario flows by
 * dragging and dropping selected EndPoints to place nodes and connecting
 * those nodes to define the flow.
 */

import React from 'react';
import { ReactFlow, MarkerType, useReactFlow, Handle, Position, NodeProps, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import SideBar from '@/common/side-bar/Sidebar.tsx';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas.ts';
import { useMappingController } from '@/pages/flow-canvas/hooks/useMappingController.ts';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode.tsx';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal.tsx';
import { KeyValue } from '@/pages/flow-canvas/types/mapping.ts';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color.ts';
const nodeTypes = { custom: CustomNode };

/**
 * Provides an interface for visualizing scenario flows and
 * allows adding endpoints as nodes via drag-and-drop.
 *
 * @returns Rendered FlowCanvas UI
 */
const FlowCanvas: React.FC = () => {
  const { wrapperRef, nodes, edges, onNodesChange, onEdgesChange, onConnect, onDragOver, onDrop } =
    useFlowCanvas();

  const {
    visible,
    leftData,
    rightData,
    leftTitle,
    rightTitle,
    rightBaseUrl,
    leftBaseUrl,
    open,
    save,
    cancel,
  } = useMappingController();
  const handleEdgeDoubleClick = (_evt: React.MouseEvent, edge: Edge) => {
    const src = nodes.find(n => n.id === edge.source);
    const tgt = nodes.find(n => n.id === edge.target);

    const toKV = (data: any): KeyValue[] =>
      Object.entries(data).map(([k, v]) => ({ key: k, value: String(v) }));

    const makeTitle = (data: any): string =>
      data ? `${data.method.toUpperCase()} ${data.path}` : '';

    open(
      src ? toKV(src.data) : [],
      tgt ? toKV(tgt.data) : [],
      src ? makeTitle(src.data) : '',
      tgt ? makeTitle(tgt.data) : '',
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
          visible={visible}
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          leftData={leftData}
          rightData={rightData}
          leftBaseUrl={leftBaseUrl}
          rightBaseUrl={rightBaseUrl}
          onSave={save}
          onCancel={cancel}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
