import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { MarkerType, Edge, Node, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode';
import styles from './styles/FlowCanvas.module.scss';
import { MockApiModal } from '@/pages/flow-canvas/components/mock-api-modal/MockApiModal';
import { useAppSelector } from '@/store/hooks';
import { scenarioTest } from '@/pages/flow-canvas/service/scenarioService';
import { scenarioToFlowElements } from '@/common/utils/scenarioToReactFlow';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';
import PlayButton from '@/common/components/PlayButton';
import CustomEdge from '@/pages/flow-canvas/components/custom-node/CustomEdge';
import { NODE, EDGE } from '@/config/reactFlow';
import ScenarioNode from '@/pages/flow-canvas/components/custom-node/ScenarioNode';
import SaveForm from '@/pages/flow-canvas/components/save-form/SaveForm';
import EdgeModal from '@/pages/flow-canvas/components/custom-node/EdgeModal';

const nodeTypes = { endpointNode: CustomNode, mockNode: CustomNode, scenarioNode: ScenarioNode };
const edgeTypes = { flowCanvasEdge: CustomEdge };

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

  const { autoSave } = useScenario();

  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);

  const [showMockApiModal, setShowMockApiModal] = useState<boolean>(false);

  const [isEdgeModalOpen, setEdgeModalOpen] = useState(false);

  const handleEdgeDoubleClick = (e: React.MouseEvent, edge: Edge) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentEdge(edge);
    setEdgeModalOpen(true);
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
    if (!fileName) {
      return;
    }
    const ok = autoSave(selectedScenario);
    if (isConnected) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    } else {
      const eventSource = scenarioTest(fileName + '.yaml');
      eventSourceRef.current = eventSource;
      setIsConnected(true);

      eventSource.addEventListener('stepResult', event => {
        const data = JSON.parse(event.data);
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
        <SaveForm />
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
            type: EDGE.FLOW_CANVAS.type,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: EDGE.FLOW_CANVAS.color },
          }}
        >
          <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>

        <EdgeModal
          isOpen={isEdgeModalOpen}
          edgeInfo={currentEdge}
          setEdges={setEdges}
          onClose={() => setEdgeModalOpen(false)}
        />

        {showMockApiModal && (
          <MockApiModal onConfirm={addNode} closeModal={() => setShowMockApiModal(false)} />
        )}
      </div>
    </>
  );
};

const nodeColor = (node: Node) => {
  switch (node.type) {
    case NODE.MOCK.type:
      return NODE.MOCK.color;
    case NODE.ENDPOINT.type:
      return NODE.ENDPOINT.color;
    case NODE.SCENARIO.type:
      return NODE.SCENARIO.color;
    default:
      return NODE.DEFALULT.color;
  }
};

export default FlowCanvas;
