/**
 * @fileoverview useFlowCanvas.ts
 *
 * A custom hook that manages ReactFlow state and drag-and-drop logic
 * for the scenario flow canvas.
 */
import { useCallback, useRef, useEffect, useState } from 'react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  NodeChange,
  reconnectEdge,
  useReactFlow,
  Node,
  EdgeChange,
  Edge as ReactEdge,
} from 'reactflow';
import { NodeEndPoint } from '@/pages/flow-canvas/types/index';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setNodes as setNodesInStore, setEdges as setEdgesInStore } from '@/store/slices/flowSlice';
import { createMockNode, createEndpointNode } from '@/common/utils/reactFlowUtils';

export const useFlowCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const storedNodes = useAppSelector(state => state.flow.nodes);
  const storedEdges = useAppSelector(state => state.flow.edges);

  const [nodes, setNodesLocal] = useState<Node[]>(storedNodes);
  const [edges, setEdgesLocal] = useState<ReactEdge[]>(storedEdges);

  useEffect(() => {
    setNodesLocal(storedNodes);
  }, [storedNodes]);

  useEffect(() => {
    setEdgesLocal(storedEdges);
  }, [storedEdges]);

  const syncToRedux = useCallback(() => {
    dispatch(setNodesInStore(nodes));
    dispatch(setEdgesInStore(edges));
  }, [dispatch, nodes, edges]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncToRedux();
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, syncToRedux]);

  const { screenToFlowPosition, project, addNodes } = useReactFlow();
  const pendingEdgeRef = useRef<Edge | null>(null);

  const setNodes = useCallback((updater: (ns: Node[]) => Node[]) => {
    setNodesLocal(updater);
  }, []);

  const setEdges = useCallback((updater: (es: ReactEdge[]) => ReactEdge[]) => {
    setEdgesLocal(updater);
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodesLocal(prev => applyNodeChanges(changes, prev));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdgesLocal(prev => applyEdgeChanges(changes, prev));
  }, []);

  const updateNode = useCallback((node: Node) => {
    setNodesLocal(prev => {
      const idx = prev.findIndex(n => n.id === node.id);
      if (idx === -1) return prev;

      const updated = [...prev];
      updated[idx] = {
        ...prev[idx],
        ...node,
        data: {
          ...prev[idx].data,
          ...node.data,
        },
      };
      return updated;
    });
  }, []);

  const onConnect = useCallback((params: Connection) => {
    console.log('[onConnect] params:', params);

    const newEdge: Edge = {
      ...params,
      id: `${params.source}-${params.target}`,
      animated: true,
      type: 'flowCanvasEdge',
      data: {
        expected: { status: '200', value: {} },
        label: '200',
      },
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle!,
      targetHandle: params.targetHandle!,
    };

    console.log('[onConnect] newEdge:', newEdge);

    setEdgesLocal(prev => {
      const updated = addEdge(newEdge, prev);
      console.log('[onConnect] updated edges:', updated);
      return updated;
    });
  }, []);

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
      const position = screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const node: Node = createEndpointNode(endpoint, position);
      setNodesLocal(ns => [...ns, node]);
    },
    [screenToFlowPosition],
  );

  const onEdgeUpdateStart = useCallback((_: any, edge: Edge) => {
    console.log('[onEdgeUpdateStart] pendingEdge:', edge.id);
    pendingEdgeRef.current = edge;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConn: Connection) => {
    console.log('[onEdgeUpdate] newConn:', newConn);
    if (newConn.target) {
      console.log('[onEdgeUpdate] reconnecting');
      setEdgesLocal(es => reconnectEdge(oldEdge, newConn, es));
      pendingEdgeRef.current = null;
    }
  }, []);

  const onEdgeUpdateEnd = useCallback(() => {
    console.log('[onEdgeUpdateEnd] pendingEdge still exists?', pendingEdgeRef.current?.id);
    if (pendingEdgeRef.current) {
      console.log('[onEdgeUpdateEnd] deleting:', pendingEdgeRef.current.id);
      setEdgesLocal(es => es.filter(e => e.id !== pendingEdgeRef.current!.id));
      pendingEdgeRef.current = null;
    }
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    event.stopPropagation();
    setEdgesLocal(es => es.filter(e => e.id !== edge.id));
  }, []);

  const addNode = useCallback(
    (vals: {
      baseUrl: string;
      method: string;
      path: string;
      requestSchema: string;
      responseSchema: string;
      x: number;
      y: number;
      header?: string;
    }) => {
      const newNode = createMockNode(vals);
      setNodesLocal(ns => ns.concat(newNode));
    },
    [],
  );

  const removeNode = useCallback((nodeId: string) => {
    setNodesLocal(prev => prev.filter(n => n.id !== nodeId));
  }, []);

  const onChangeLabel = useCallback(
    (edgeId: string, newLabel: string) => {
      setEdges(prev =>
        prev.map(edge =>
          edge.id === edgeId
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  expected: { ...edge.data?.expected, status: newLabel },
                },
              }
            : edge,
        ),
      );
    },
    [setEdges],
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent, endpoint: NodeEndPoint) => {
      const position = project({ x: e.clientX, y: e.clientY });
      const req = endpoint.requestSchema ?? [];
      const res = endpoint.responseSchema ?? [];

      setNodesLocal(ns => [
        ...ns,
        {
          id: `${endpoint.endpointId}_${Date.now()}`,
          type: 'endpointNode',
          position,
          data: {
            ...endpoint,
            requestSchema: req,
            responseSchema: res,
            showBody: false,
          },
        },
      ]);
    },
    [screenToFlowPosition],
  );

  return {
    wrapperRef,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    updateNode,
    onConnect,
    onDragOver,
    onDrop,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    onEdgeContextMenu,
    addNode,
    removeNode,
    setNodes,
    setEdges,
    onChangeLabel,
    onDoubleClick,
  };
};
