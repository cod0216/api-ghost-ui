import { Node, Edge, MarkerType, Connection } from 'reactflow';
import { NODE, EDGE } from '@/config/reactFlow';
import { FlowRoute, FlowStep } from '@/pages/flow-canvas/types';
import { NodeEndPoint, Field } from '@/pages/flow-canvas/types/index';

export const createMockNode = (vals: {
  baseUrl: string;
  method: string;
  path: string;
  requestSchema: Field[];
  responseSchema: Field[];
  x: number;
  y: number;
  header?: Record<string, string>;
}): Node<NodeEndPoint> => {
  const id = `mock-${vals.baseUrl}-${vals.method}-${vals.path}`;

  const newNode = {
    id,
    type: NODE.MOCK.type,
    position: { x: vals.x, y: vals.y },
    data: {
      endpointId: id,
      baseUrl: vals.baseUrl,
      method: vals.method,
      path: vals.path,
      requestSchema: vals.requestSchema,
      responseSchema: vals.responseSchema,
      showBody: false,
      header: vals.header,
    },
  };

  return newNode;
};

export const creatScenarioNode = (stepId: string, step: FlowStep): Node => ({
  id: stepId,
  type: NODE.SCENARIO.type,
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
});

export const createEndpointNode = (
  endpoint: NodeEndPoint,
  position: { x: number; y: number },
): Node<NodeEndPoint> => {
  const id = `${endpoint.endpointId}-${Date.now()}`;

  return {
    id,
    type: NODE.ENDPOINT.type,
    position,
    data: {
      ...endpoint,
      requestSchema: endpoint.requestSchema ?? [],
      responseSchema: endpoint.responseSchema ?? [],
      showBody: false,
    },
  };
};

export const createFlowEdge = (route: FlowRoute, source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  type: EDGE.FLOW_CANVAS.type,
  source,
  target: route.then.step,
  animated: true,
  data: {
    expected: route.expected ? route.expected : '200',
    then: route.then,
  },
});

export const createConnectedEdge = (params: Connection): Edge => {
  const { source, target, sourceHandle, targetHandle } = params;

  return {
    id: `${source}-${target}`,
    type: EDGE.FLOW_CANVAS.type,
    animated: true,
    source: source!,
    target: target!,
    sourceHandle: sourceHandle!,
    targetHandle: targetHandle!,
    data: EDGE.FLOW_CANVAS.defalutExpected,
  };
};
