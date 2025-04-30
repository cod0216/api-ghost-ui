/**
 * @fileoverview useFlowCanvas.ts
 *
 * A custom hook that manages ReactFlow state and drag-and-drop logic
 * for the scenario flow canvas.
 */
import { useCallback, useRef } from 'react';
import {
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  useNodesState,
  useEdgesState,
  XYPosition,
} from 'reactflow';
import { Endpoint } from '@/pages/flow-canvas/data/endpoint.ts';

interface FlowNodeData {
  baseUrl: string;
  method: string;
  path: string;
  showBody: boolean;
  body?: any;
}
type FlowNode = Node<FlowNodeData>;

export function useFlowCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const { project } = useReactFlow();

  /**
   * Adds a new edge when two nodes are connected.
   *
   * @param params - edge or connection parameters
   */

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(es => addEdge(params, es)),
    [setEdges],
  );

  /**
   * Prevents default behavior and sets move effect during drag over.
   *
   * @param e - React drag event
   */
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Reads the dropped Endpoint data, creates a new node, and appends it.
   *
   * @param e - React drag event
   */
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!wrapperRef.current) return;
      const bounds = wrapperRef.current.getBoundingClientRect();
      const data = e.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const endpoint: Endpoint = JSON.parse(data);
      const position = project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      setNodes(ns => [
        ...ns,
        {
          id: `${endpoint.id}_${Date.now()}`,
          type: 'custom',
          position,
          data: {
            baseUrl: 'https://ssafy.com',
            method: endpoint.method.toLowerCase(),
            path: endpoint.path,
            showBody: false,
          },
        },
      ]);
    },
    [project, setNodes],
  );

  return { wrapperRef, nodes, edges, onNodesChange, onEdgesChange, onConnect, onDragOver, onDrop };
}
