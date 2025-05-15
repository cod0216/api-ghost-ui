import { Node, Edge } from 'reactflow';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import { parseBaseUrl, parseEndpoint } from '@/common/utils/jsonUtils';

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
        baseUrl: parseBaseUrl(step.request.url),
        method: step.request.method,
        path: parseEndpoint(step.request.url),
        requestSchema: step.request.body,
        responseSchema: step.route.map(r => r.expected),
        showBody: false,
      },
    };
    nodes.push(node);

    step.route.forEach((route, idx) => {
      const edge: Edge = {
        type: 'flowCanvasEdge',
        id: `e-${stepId}-${route.then.step}-${idx}`,
        source: stepId,
        target: route.then.step,
        animated: true,
        data: {
          expected: route.expected,
          then: route.then,
        },
      };
      edges.push(edge);
    });
  });

  return { nodes, edges };
};
