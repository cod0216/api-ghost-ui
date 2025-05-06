import React, { useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState, useReactFlow, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import ApiRequestNode from '@/pages/dashboard/components/flow-graph-area/ApiRequestNode.tsx';
import { ResultItem } from '@/common/types/index.ts';
import { buildFlowElements } from '@/pages/dashboard/utils/rechartUtils.ts';
import styles from '@/pages/dashboard/styles/FlowGraphArea.module.scss';

const nodeTypes: NodeTypes = {
  apiRequest: ApiRequestNode,
};

interface ApiTestFlowGraphProps {
  apiResults: ResultItem[];
}

const ApiTestFlowGraph: React.FC<ApiTestFlowGraphProps> = ({ apiResults }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (apiResults.length === 0) return;

    const { nodes: newNodes, edges: newEdges } = buildFlowElements(apiResults);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [apiResults]);

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
