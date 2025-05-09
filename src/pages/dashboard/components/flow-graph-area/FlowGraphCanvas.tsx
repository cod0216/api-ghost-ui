import React, { useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState, useReactFlow, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import ApiRequestNode from '@/pages/dashboard/components/flow-graph-area/ApiRequestNode.tsx';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';
import { buildFlowElements } from '@/pages/dashboard/utils/rechartUtils.ts';
import styles from '@/pages/dashboard/styles/FlowGraphArea.module.scss';

const nodeTypes: NodeTypes = {
  apiRequest: ApiRequestNode,
};

interface ApiTestFlowGraphProps {
  results: ScenarioTestDetailResponseResult[];
}

/**
 * Renders a dynamic flow graph based on scenario test results.
 *
 * @param props - Component props containing the list of scenario test results.
 * @returns A flow graph component visualizing the API request sequence and result data.
 *
 * @author haerim-kweon
 */
const ApiTestFlowGraph: React.FC<ApiTestFlowGraphProps> = ({ results }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (results.length === 0) return;

    const { nodes: newNodes, edges: newEdges } = buildFlowElements(results);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [results]);

  useEffect(() => {
    if (nodes.length > 0) {
      const timeout = setTimeout(() => {
        fitView({ padding: 0.1, includeHiddenNodes: true });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [nodes, fitView]);

  return (
    <div className={styles.flowGraph}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        maxZoom={1.2}
        minZoom={0.2}
        proOptions={{ hideAttribution: true }}
        attributionPosition="bottom-right"
      />
    </div>
  );
};

export default ApiTestFlowGraph;
