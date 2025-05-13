import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { MarkerType, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';
import { useMappingModal } from '@/pages/flow-canvas/hooks/useMappingModal';
import CustomNode from '@/pages/flow-canvas/components/custom-node/CustomNode';
import { MappingModal } from '@/pages/flow-canvas/components/mapping-modal/MappingModal';
import styles from './styles/FlowCanvas.module.scss';
import { COLORS } from '@/pages/flow-canvas/constants/color';
import { flattenSchema } from '@/common/utils/schemaUtils';
import { useMockApiModal } from '@/pages/flow-canvas/hooks/useMockApiModal';
import { MockApiModal } from '@/pages/flow-canvas/components/mock-api-modal/MockApiModal';
import CommonSidebar from '@/common/components/CommonSidebar';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList';
import { useAppSelector } from '@/store/hooks';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
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
('@/common/components/playButton');
import CustomEdge from '@/pages/flow-canvas/components/custom-node/CustomEdge';

const nodeTypes = { endpointNode: CustomNode };
// const edgeTypes = { flowCanvasEdge: CustomEdge };

type NodeType = Node<NodeEndPoint>;

const FlowCanvas: React.FC = () => {
  const {
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
    removeNode,
    setNodes,
    setEdges,
  } = useFlowCanvas();

  const {
    isModalVisible,
    leftKeyValueList,
    rightKeyValueList,
    leftEndpointTitle,
    rightEndpointTitle,
    leftEndpointBaseUrl,
    rightEndpointBaseUrl,
    openMappingModal,
    cancelMappingModal,
    leftSelectedKey,
    rightSelectedKey,
  } = useMappingModal();

  const onChangeLabel = useCallback(
    (edgeId: string, newLabel: string) => {
      setEdges(prev =>
        prev.map(edge =>
          edge.id === edgeId
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  label: newLabel,
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

  const {
    isVisible: isMockVisible,
    formValues,
    baseUrl,
    path,
    method,
    isSchemaValid,
    openMockApiModal,
    saveMockApi,
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

  const [currentEdgeId, setCurrentEdgeId] = useState<string | null>(null);
  const [currentSrc, setCurrentSrc] = useState<NodeType | null>(null);
  const [currentTgt, setCurrentTgt] = useState<NodeType | null>(null);
  const handleSave = useScenario();
  const viewport = useAppSelector(state => state.flow.viewport);

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    setCurrentEdgeId(edge.id);
    const srcNode = nodes.find(n => n.id === edge.source)!;
    const tgtNode = nodes.find(n => n.id === edge.target)!;
    setCurrentSrc(srcNode);
    setCurrentTgt(tgtNode);

    const respList = flattenSchema(srcNode.data.responseSchema ?? []);
    const reqList = flattenSchema(tgtNode.data.requestSchema ?? []);
    const titleLeft = `${srcNode.data.method} ${srcNode.data.path}`;
    const titleRight = `${tgtNode.data.method} ${tgtNode.data.path}`;
    const existing: MappingPair[] = (edge.data as any)?.mappingInfo ?? [];
    openMappingModal(
      respList,
      reqList,
      titleLeft,
      titleRight,
      srcNode.data.baseUrl,
      tgtNode.data.baseUrl,
      existing,
    );
  };

  const handleConfirmMapping = (pairs: MappingPair[]) => {
    if (!currentEdgeId) return;
    setEdges(es =>
      es.map(e =>
        e.id === currentEdgeId ? { ...e, data: { ...(e.data ?? {}), mappingInfo: pairs } } : e,
      ),
    );
    cancelMappingModal();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    openMockApiModal(e.clientX - bounds.left, e.clientY - bounds.top);
  };

  ///
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioInfo | null>(null);
  // const saveScenario = useScenario();
  const hasSaved = useRef(true);

  useEffect(() => {
    if (!selectedScenario) {
      handleSave().then(fileName => {
        if (fileName) {
          onSelect(fileName);
        }
      });
      hasSaved.current = true;
    }
  }, [handleSave]);

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
          // defaultViewport={viewport}
          // fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.5}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'flowCanvasEdge',
            animated: true,
            label: '200',
            data: {
              expected: {
                status: '200',
                value: {},
              },
            },
            markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.allow },
          }}
        />
        <MappingModal
          isVisible={isModalVisible}
          modalTitle="Field Mapping"
          panelLabels={['Response', 'Request']}
          leftEndpointTitle={leftEndpointTitle}
          rightEndpointTitle={rightEndpointTitle}
          leftKeyValueList={leftKeyValueList}
          rightKeyValueList={rightKeyValueList}
          leftEndpointBaseUrl={leftEndpointBaseUrl}
          rightEndpointBaseUrl={rightEndpointBaseUrl}
          leftSelectedKey={leftSelectedKey}
          rightSelectedKey={rightSelectedKey}
          onConfirm={handleConfirmMapping}
          onDismiss={cancelMappingModal}
        />

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
          saveMockApi={saveMockApi}
          onConfirm={addNode}
          onCancel={closeMockApiModal}
          validateSchemas={validateSchemas}
        />
      </div>
    </div>
  );
};

export default FlowCanvas;
