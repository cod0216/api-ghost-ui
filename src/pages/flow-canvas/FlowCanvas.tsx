import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { MarkerType, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color';
import { useMockApiModal } from '@/pages/flow-canvas/hooks/useMockApiModal';
import { MockApiModal } from '@/pages/flow-canvas/components/mock-api-modal/MockApiModal';
import CommonSidebar from '@/common/components/CommonSidebar';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList';
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

const nodeTypes = { endpointNode: CustomNode };
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
  const {
    isVisible: isMockVisible, //TODO
    formValues,
    baseUrl,
    path,
    method,
    isSchemaValid,
    openMockApiModal,
    closeMockApiModal,
    reqSchemaText,
    resSchemaText,
    setBaseUrl,
    setMethod,
    setPath,
    setIsSchemaValid,
    setReqSchemaText,
    setResSchemaText,
    validateSchemas,
  } = useMockApiModal();

  const saveScenario = useScenario();

  const handleSave = () => {
    saveScenario();
  };
  const reduxEdges = useAppSelector(state => state.flow.edges);

  // useEffect(() => {
  //   console.log(
  //     '[FlowCanvas] edges.mappingInfo →',
  //     reduxEdges.map(e => ({
  //       id: e.id,
  //       mappingInfo: (e.data as any)?.mappingInfo ?? null,
  //     })),
  //   );
  // }, [reduxEdges]);

  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    setCurrentEdge(edge);
    setShowMappingModal(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    openMockApiModal(e.clientX - bounds.left, e.clientY - bounds.top);
  };

  const [scenarios, setScenarios] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioInfo | null>(null);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!hasSaved.current) {
      saveScenario().then(fileName => {
        if (fileName) {
          onSelect(fileName);
        }
      });
      hasSaved.current = true;
    }
  }, [saveScenario]);

  useEffect(() => {
    getScenarioList()
      .then(setScenarios)
      .catch(err => console.error('[ScenarioList] getScenarioList Error', err));
  }, []);

  const onSelect = async (fileName: string) => {
    await getScenarioInfo(fileName)
      .then(setSelectedScenario)
      .catch(err => console.error('[ScenarioList] getScenarioInfo Error', err));
  };

  useEffect(() => {
    if (!selectedScenario) return;

    const { nodes: parsedNodes, edges: parsedEdges } = scenarioToFlowElements(selectedScenario);
    setNodes(() => parsedNodes);
    setEdges(() => parsedEdges);
  }, [selectedScenario]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handlePlay = (fileName: string | undefined) => {
    if (!fileName) return;
    if (isConnected) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    } else {
      const eventSource = scenarioTest(fileName);
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
    <div className={styles.container}>
      <CommonSidebar
        sections={[
          { title: 'API List', content: <ApiList /> },
          {
            title: 'Scenario List',
            content: <ScenarioList scenarios={scenarios} onSelect={onSelect} />,
          },
        ]}
      />
      <div className={styles.actionContainer}>
        <PlayButton onPlay={handlePlay} selectedScenario={selectedScenario} /> |
        <SaveButton onSave={handleSave} />
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
          fitView
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.allow },
          }}
        />
        {showMappingModal && currentEdge && (
          <MappingModal
            closeModal={() => setShowMappingModal(false)}
            edge={currentEdge}
            nodes={nodes}
            setEdges={setEdges}
          />
        )}
        <MockApiModal
          isVisible={isMockVisible}
          formValues={formValues}
          baseUrl={baseUrl}
          path={path}
          method={method}
          isSchemaValid={isSchemaValid}
          reqSchemaText={reqSchemaText}
          resSchemaText={resSchemaText}
          setBaseUrl={setBaseUrl}
          setMethod={setMethod}
          setPath={setPath}
          setIsSchemaValid={setIsSchemaValid}
          setReqSchemaText={setReqSchemaText}
          setResSchemaText={setResSchemaText}
          onConfirm={addNode}
          onCancel={closeMockApiModal}
          validateSchemas={validateSchemas}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
