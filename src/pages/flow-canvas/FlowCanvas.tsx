/**
 * @fileoverview FlowCanvas.tsx
 *
 * FlowCanvas provides a UI where users can construct scenario flows by
 * dragging and dropping selected EndPoints to place nodes and connecting
 * those nodes to define the flow.
 */

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  useReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import { Endpoint } from '@/pages/flow-canvas/data/endpoint.ts';
import styles from '@/pages/flow-canvas/FlowCanvas.module.scss';
import SideBar from '@/pages/flow-canvas/side-bar/Sidebar.tsx';
import 'reactflow/dist/style.css';

/**
 * Provides an interface for visualizing scenario flows and
 * allows adding endpoints as nodes via drag-and-drop.
 *
 * @returns Rendered FlowCanvas UI
 */
const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const endpoint: Endpoint = JSON.parse(data);
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const newNode: Node = {
        id: `${endpoint.id}_${Date.now()}`,
        type: 'default',
        position,
        data: { label: `${endpoint.method} ${endpoint.path}` },
      };
      setNodes(nds => nds.concat(newNode));
    },
    [project, setNodes],
  );

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.canvas} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
