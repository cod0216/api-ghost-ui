/** API Endpoint interface */
import { HttpMethod } from './index';

export interface Field {
  type: string;
  name: string;
  nestedFields?: Field[];
}

export interface ApiEndpoint {
  protocolType: 'HTTP' | 'STOMP' | string;
  baseUrl: string;
  methodName: string;
  httpMethod: HttpMethod;
  path: string;
  produces: string[];
  consumes: string[];
  requestSchema: Field[] | null;
  responseSchema: Field[] | null;
  headers?: { key: string; value: string }[] | null;
  cookies?: { key: string; value: string }[] | null;
  requestParams?: { key: string; value: string }[] | null;
  pathVariables?: { key: string; value: string }[] | null;
}

export interface NodeEndPoint {
  endpointId: string;
  header?: string;
  method: HttpMethod | string;
  path: string;
  baseUrl: string;

  requestSchema?: Field[];
  responseSchema?: Field[];

  showBody: boolean;
}

export interface FlowNode {
  nodeId: string;
  spec: NodeEndPoint;
  position: { x: number; y: number };
}
