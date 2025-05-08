/** API Endpoint interface */
import { HttpMethod } from './index';

export interface Field {
  type: string;
  name: string;
  nestedFields?: Field[];
  value?: string | number | boolean;
}

export interface ApiEndpoint {
  protocolType: 'HTTP' | 'STOMP' | string;
  baseUrl: string;
  methodName: string;
  httpMethod: HttpMethod;
  path: string;
  produces: string[];
  consumes: string[];
  requestSchema?: Field[];
  responseSchema?: Field[];
  headers?: { key: string; value: string }[];
  cookies?: { key: string; value: string }[];
  requestParams?: { key: string; value: string }[];
  pathVariables?: { key: string; value: string }[];
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
