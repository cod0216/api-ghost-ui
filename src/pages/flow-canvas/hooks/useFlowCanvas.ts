/**
 * @fileoverview useFlowCanvas.ts
 *
 * A custom hook that manages ReactFlow state and drag-and-drop logic
 * for the scenario flow canvas.
 */
import { useCallback, useRef, useState } from 'react';
import {
  addEdge,
  Connection,
  Edge,
  reconnectEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { NodeEndPoint, Field } from '@/common/types/index.ts';

export const useFlowCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeEndPoint>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const { project } = useReactFlow();
  const pendingEdgeRef = useRef<Edge | null>(null);
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
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const endpoint: NodeEndPoint = JSON.parse(data);
      const position = project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      setNodes(ns => [
        ...ns,
        {
          id: `${endpoint.endpointId}_${Date.now()}`,
          type: 'endpointNode',
          position,
          data: {
            endpointId: endpoint.endpointId,
            header: endpoint.header,
            baseUrl: endpoint.baseUrl,
            method: endpoint.method,
            path: endpoint.path,
            requestSchema: endpoint.requestSchema,
            responseSchema: endpoint.responseSchema,
            showBody: false,
          },
        },
      ]);
    },
    [project, setNodes],
  );

  const onEdgeUpdateStart = useCallback((_: any, edge: Edge) => {
    pendingEdgeRef.current = edge;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConn: Connection) => {
      if (newConn.target) {
        setEdges(es => reconnectEdge(oldEdge, newConn, es));
        pendingEdgeRef.current = null;
      }
    },
    [setEdges],
  );

  const onEdgeUpdateEnd = useCallback(() => {
    const edge = pendingEdgeRef.current;
    if (edge) {
      setEdges(es => es.filter(e => e.id !== edge.id));
      pendingEdgeRef.current = null;
    }
  }, [setEdges]);

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setEdges(es => es.filter(e => e.id !== edge.id));
    },
    [setEdges],
  );

  const addNode = useCallback(
    (vals: {
      baseUrl: string;
      method: string;
      path: string;
      requestSchema: Field[];
      responseSchema: Field[];
      x: number;
      y: number;
    }) => {
      const id = `mock-${Date.now()}`;
      const newNode = {
        id,
        type: 'endpointNode',
        position: { x: vals.x, y: vals.y },
        data: {
          endpointId: id,
          baseUrl: vals.baseUrl,
          method: vals.method,
          path: vals.path,
          requestSchema: vals.requestSchema,
          responseSchema: vals.responseSchema,
          showBody: false,
        } as NodeEndPoint,
      };
      setNodes(ns => ns.concat(newNode));
    },
    [setNodes],
  );

  return {
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
    addNode,
  };
};
