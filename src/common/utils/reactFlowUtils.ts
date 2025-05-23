import { Node, Edge, MarkerType, Connection } from 'reactflow';
import { NODE, EDGE } from '@/config/reactFlow';
import { FlowRoute, FlowStep } from '@/pages/flow-canvas/types';
import { NodeEndPoint } from '@/pages/flow-canvas/types/index';
import { parseBaseUrl, parseEndpoint } from '@/common/utils/jsonUtils';
import { HttpMethod } from '@/common/types/index';

const DEFAULT_HEADER_OBJ = { 'Content-Type': 'application/json' };
const DEFAULT_HEADER_JSON = JSON.stringify(DEFAULT_HEADER_OBJ, null, 2);

export const createMockNode = (vals: {
  baseUrl: string;
  method: HttpMethod | string;
  path: string;
  requestSchema: string;
  responseSchema: string;
  x: number;
  y: number;
  header?: string;
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

export const creatScenarioNode = (stepId: string, step: FlowStep): Node => {
  const headerJson = JSON.stringify(step.request.header ?? {}, null, 2);
  const displayHeader = headerJson === DEFAULT_HEADER_JSON ? '' : headerJson;

  const rawJson = step.request.body;
  const requestJsonString =
    typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson ?? {}, null, 2);

  return {
    id: stepId,
    type: NODE.SCENARIO.type,
    position: step.position,
    data: {
      endpointId: stepId,
      header: displayHeader,
      baseUrl: parseBaseUrl(step.request.url),
      method: step.request.method,
      path: parseEndpoint(step.request.url),
      requestSchema: step.request.body,
      responseSchema: null,
      showBody: false,
    },
  };
};

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
      requestSchema: endpoint.requestSchema ?? '{}',
      responseSchema: endpoint.responseSchema ?? '{}',
      showBody: false,
    },
  };
};

export const createFlowEdge = (route: FlowRoute, source: string): Edge => {
  const mappingInfo = route.then.store
    ? Object.entries(route.then.store).map(([targetKey, sourceKey]) => ({
        sourceKey,
        targetKey,
      }))
    : [];

  return {
    id: `${source}-${route.then.step}`,
    type: EDGE.FLOW_CANVAS.type,
    source,
    target: route.then.step,
    animated: true,
    data: {
      expected: route.expected,
      mappingInfo,
    },
  };
};

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
