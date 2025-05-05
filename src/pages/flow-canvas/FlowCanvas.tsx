/**
 * @fileoverview FlowCanvas.tsx
 *
 * FlowCanvas provides a UI where users can construct scenario flows by
 * dragging and dropping selected EndPoints to place nodes and connecting
 * those nodes to define the flow.
 */

import React from 'react';
import { ReactFlow, MarkerType, useReactFlow, Handle, Position, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import SideBar from '@/common/side-bar/Sidebar.tsx';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas.ts';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode.tsx';
import styles from './styles/FlowCanvas.module.scss';
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
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#25297f' },
          }}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
