import { Node, Edge } from 'reactflow';
import { ScenarioInfo } from '@/pages/flow-canvas/types';

export const scenarioToFlowElements = (
  scenario: ScenarioInfo | null,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!scenario) return { nodes, edges };

  Object.entries(scenario.steps).forEach(([stepId, step]) => {
    const node: Node = {
      id: stepId,
      type: 'endpointNode',
      position: step.position,
      data: {
        endpointId: stepId,
        header: step.request.header,
        baseUrl: step.request.url,
        method: step.request.method,
        path: step.request.url,
        requestSchema: step.request.body,
        responseSchema: step.route.map(r => r.expected),
        showBody: false,
      },
    };
    nodes.push(node);

    step.route.forEach((route, idx) => {
      const edge: Edge = {
        id: `e-${stepId}-${route.then.step}-${idx}`,
        source: stepId,
        target: route.then.step,
        label: route.expected.status,
        animated: true,
      };
      edges.push(edge);
    });
  });

  return { nodes, edges };
};
