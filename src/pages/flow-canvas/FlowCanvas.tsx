import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { MarkerType, Edge, Node, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color';
import { MockApiModal } from '@/pages/flow-canvas/components/mock-api-modal/MockApiModal';
import { useAppSelector } from '@/store/hooks';

import { NodeEndPoint } from '@/pages/flow-canvas/types';
import {
  getScenarioList,
  getScenarioInfo,
  scenarioTest,
} from '@/pages/flow-canvas/service/scenarioService';
import { ScenarioInfo } from '@/pages/flow-canvas/types/index.ts';
import { scenarioToFlowElements } from '@/common/utils/scenarioToReactFlow';
import { useScenario } from './hooks/useScenario';
import SaveButton from '@/common/components/SaveButton';
import PlayButton from '@/common/components/PlayButton';
import CustomEdge from '@/pages/flow-canvas/components/custom-node/CustomEdge';
const nodeTypes = { endpointNode: CustomNode, mockNode: CustomNode };

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
    setNodes,
  } = useFlowCanvas();

  const [showMappingModal, setShowMappingModal] = useState<boolean>(false);
  const { saveScenario } = useScenario();

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

  const edgeTypes = useMemo(
    () => ({
      flowCanvasEdge: (edgeProps: any) => (
        <CustomEdge {...edgeProps} onChangeLabel={onChangeLabel} />
      ),
    }),
    [onChangeLabel],
  );

  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);

  const [showMockApiModal, setShowMockApiModal] = useState<boolean>(false);

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    setCurrentEdge(edge);
    setShowMappingModal(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wrapperRef.current) return;
    setShowMockApiModal(true);
  };

  const selectedScenario = useAppSelector(state => state.scenario.selected);

  useEffect(() => {
    if (!selectedScenario) return;

    const { nodes: parsedNodes, edges: parsedEdges } = scenarioToFlowElements(selectedScenario);
    setNodes(() => parsedNodes);
    setEdges(() => parsedEdges);
  }, [selectedScenario]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handlePlay = (fileName: string | undefined) => {
    console.log('hihihihi');
    if (!fileName) {
      console.log('heelo!!');
      return;
    }
    if (isConnected) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    } else {
      const eventSource = scenarioTest(fileName);
      console.log(fileName);
      eventSourceRef.current = eventSource;
      setIsConnected(true);

      eventSource.addEventListener('stepResult', event => {
        const data = JSON.parse(event.data);
        console.log(data);
      });

      eventSource.addEventListener('complete', event => {
        const result = JSON.parse(event.data);
        eventSource.close();
        eventSourceRef.current = null;
        setIsConnected(false);
        console.log(result);
      });

      eventSource.onerror = e => {
        console.log(e);
        eventSource.close();
        eventSourceRef.current = null;
        setIsConnected(false);
      };
    }
  };

  return (
    <>
      <div className={styles.actionContainer}>
        <PlayButton onPlay={handlePlay} selectedScenario={selectedScenario} /> |
        <SaveButton onSave={saveScenario} />
      </div>
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
          proOptions={{ hideAttribution: true }}
          minZoom={0.5}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'flowCanvasEdge',
            animated: true,
            data: {
              expected: {
                status: '200',
                value: {},
              },
            },
            markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.allow },
          }}
        >
          <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>

        {showMappingModal && currentEdge && (
          <MappingModal
            closeModal={() => setShowMappingModal(false)}
            edge={currentEdge}
            nodes={nodes}
            setEdges={setEdges}
          />
        )}
        {showMockApiModal && (
          <MockApiModal onConfirm={addNode} closeModal={() => setShowMockApiModal(false)} />
        )}
      </div>
    </>
  );
};

const nodeColor = (node: any) => {
  switch (node.type) {
    case 'mockNode':
      return '#6ede87';
    case 'endpointNode':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

export default FlowCanvas;
