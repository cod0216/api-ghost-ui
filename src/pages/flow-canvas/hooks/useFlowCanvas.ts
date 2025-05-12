/**
 * @fileoverview useFlowCanvas.ts
 *
 * A custom hook that manages ReactFlow state and drag-and-drop logic
 * for the scenario flow canvas.
 */
import { useCallback, useRef, useEffect } from 'react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  NodeChange,
  reconnectEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  EdgeChange,
  Edge as ReactEdge,
} from 'reactflow';
import { NodeEndPoint, Field } from '@/pages/flow-canvas/types/index';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setNodes as setNodesInStore,
  setEdges as setEdgesInStore,
  updateNode as updateNodeInStore,
} from '@/store/slices/flowSlice';

export const useFlowCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const storedNodes = useAppSelector(state => state.flow.nodes);
  const storedEdges = useAppSelector(state => state.flow.edges);
  const viewport = useAppSelector(state => state.flow.viewport);

  const [nodes, _setNodes, internalOnNodesChange] = useNodesState<NodeEndPoint>(storedNodes);
  const [edges, _setEdges, internalOnEdgesChange] = useEdgesState<ReactEdge>(storedEdges);
  const { project } = useReactFlow();
  const pendingEdgeRef = useRef<Edge | null>(null);

  const setNodes = useCallback(
    (updater: (ns: Node<NodeEndPoint>[]) => Node<NodeEndPoint>[]) => {
      _setNodes(ns => {
        const next = updater(ns);
        return next;
      });
      dispatch(setNodesInStore(nodes));
    },
    [dispatch, _setNodes],
  );

  useEffect(() => {
    dispatch(setNodesInStore(nodes));
  }, [nodes]);

  const setEdges = useCallback(
    (updater: (es: ReactEdge[]) => ReactEdge[]) => {
      _setEdges(es => {
        const next = updater(es);
        return next;
      });
      dispatch(setEdgesInStore(edges));
    },
    [dispatch, _setEdges],
  );

  useEffect(() => {
    dispatch(setEdgesInStore(edges));
  }, [edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(ns => applyNodeChanges(changes, ns));
    },
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(es => applyEdgeChanges(changes, es));
    },
    [setEdges],
  );

  const updateNode = useCallback(
    (node: Node<NodeEndPoint>) => {
      setNodes(ns => {
        const idx = ns.findIndex(n => n.id === node.id);
        if (idx !== -1) {
          const next = [...ns];
          next[idx] = node;
          return next;
        }
        return ns;
      });
      dispatch(updateNodeInStore(node));
    },
    [dispatch, setNodes],
  );

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
      const req = endpoint.requestSchema ?? [];
      const res = endpoint.responseSchema ?? [];
      setNodes(ns => [
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
      event.stopPropagation();
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

  const removeNode = useCallback(
    (nodeId: String) => {
      setNodes(ns => ns.filter(n => n.id !== nodeId));
    },
    [setNodes],
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
    viewport,
    setNodes,
    setEdges,
  };
};
