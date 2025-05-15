import { Node, Edge } from 'reactflow';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import { createFlowEdge, creatScenarioNode } from '@/common/utils/reactFlowUtils';
export const scenarioToFlowElements = (
  scenario: ScenarioInfo | null,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!scenario) return { nodes, edges };

  Object.entries(scenario.steps).forEach(([stepId, step]) => {
    const node: Node = creatScenarioNode(stepId, step);
    nodes.push(node);

    step.route.forEach((route, idx) => {
      const edge: Edge = createFlowEdge(route, stepId);
      edges.push(edge);
    });
  });

  return { nodes, edges };
};
