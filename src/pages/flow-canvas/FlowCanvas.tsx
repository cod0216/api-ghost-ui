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
import { TestStatus } from '@/pages/flow-canvas/types';
import { StepResult } from '@/pages/flow-canvas/types/endpointTypes';
import { COLORS } from '@/pages/flow-canvas/constants/color';
import { useToast } from '@/common/components/toast/ToastContext';

import PLAY from '@/assets/icons/play.svg';
import SUCCESS from '@/assets/icons/success.svg';
import PLAYING from '@/assets/icons/playing.svg';
import ERROR from '@/assets/icons/error.svg';

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
  const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [stepResults, setStepResults] = useState<any[]>([]);
  const { addToast } = useToast();

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
    addToast('test is running..', 4000);
    if (!fileName) {
      return;
    }
    const ok = autoSave(selectedScenario);
    if (isConnected) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setTestStatus(TestStatus.IDLE);
    } else {
      setStepResults([]);
      setTestStatus(TestStatus.RUNNING);
      const eventSource = scenarioTest(fileName + '.yaml');
      eventSourceRef.current = eventSource;
      setIsConnected(true);

      eventSource.addEventListener('stepResult', event => {
        try {
          const stepResult = JSON.parse(event.data) as StepResult;
          const { stepName, nextStep, isRequestSuccess } = stepResult;
          const success = stepResult.isRequestSuccess;

          setNodes(prev =>
            prev.map(node =>
              node.id === stepResult.stepName
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      isSuccess: success,
                      isFail: !success,
                    } as typeof node.data,
                  }
                : node,
            ),
          );

          if (nextStep) {
            setEdges(prevEdges =>
              prevEdges.map(edge => {
                if (edge.source === stepName && edge.target === nextStep) {
                  return {
                    ...edge,
                    style: {
                      stroke: COLORS.complete,
                      strokeWidth: 10,
                    },
                    animated: false,
                  };
                }
                return edge;
              }),
            );
          }
          setStepResults(prev => [...prev, stepResult]);
        } catch (error) {
          console.error('Error parsing stepResult:', error);
        }
      });

      eventSource.addEventListener('complete', event => {
        setTestStatus(TestStatus.COMPLETE);
        const result = JSON.parse(event.data);
        eventSource.close();
        addToast('The test was successfully completed.', 4000);
        eventSourceRef.current = null;
        setIsConnected(false);
      });

      eventSource.onerror = e => {
        console.log(e);
        eventSource.close();
        addToast('An error occurred during test execution.', 4000);
        eventSourceRef.current = null;
        setIsConnected(false);
        setTestStatus(TestStatus.ERROR);
      };
    }
  };

  return (
    <>
      <div className={styles.actionContainer}>
        {testStatus === TestStatus.IDLE && (
          <PlayButton path={PLAY} onPlay={handlePlay} selectedScenario={selectedScenario} />
        )}
        {testStatus === TestStatus.RUNNING && (
          <PlayButton
            path={PLAYING}
            onPlay={handlePlay}
            selectedScenario={selectedScenario}
            loading={testStatus === TestStatus.RUNNING}
          />
        )}
        {testStatus === TestStatus.COMPLETE && (
          <PlayButton path={SUCCESS} onPlay={handlePlay} selectedScenario={selectedScenario} />
        )}
        {testStatus === TestStatus.ERROR && (
          <PlayButton path={ERROR} onPlay={handlePlay} selectedScenario={selectedScenario} />
        )}
        |
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

        {isEdgeModalOpen && currentEdge && (
          <EdgeModal
            edgeInfo={currentEdge}
            setEdges={setEdges}
            onClose={() => setEdgeModalOpen(false)}
          />
        )}

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
