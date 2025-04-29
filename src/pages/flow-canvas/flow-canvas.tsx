import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import { Endpoint } from '@/pages/flow-canvas/data/endpoint.ts';
import styles from './flow-canvas.module.scss';
import SideBar from '@/pages/flow-canvas/side-bar/side-bar.tsx';
import 'reactflow/dist/style.css';

const FlowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

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
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const endpoint: Endpoint = JSON.parse(data);
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const newNode: Node = {
        id: endpoint.id,
        type: 'default',
        position,
        data: { label: `${endpoint.method} ${endpoint.path}` },
      };
      setNodes(nds => nds.concat(newNode));
    },
    [setNodes],
  );

  return (
    <ReactFlowProvider>
      <div className={styles.container}>
        <SideBar />
        <div className={styles.canvas} onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowCanvas;
