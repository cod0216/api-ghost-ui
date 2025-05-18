import { HttpMethod, ProtocolType } from '@/common/types/index.ts';

export interface FlowNode {
  nodeId: string;
  spec: NodeEndPoint;
  position: { x: number; y: number };
}

export interface ApiEndpoint {
  protocolType: ProtocolType | string;
  baseUrl: string;
  methodName: string;
  httpMethod: HttpMethod;
  path: string;
  produces: string[];
  consumes: string[];
  requestSchema: string | null;
  responseSchema: string | null;
  headers?: string | null;
  cookies?: string | null;
  requestParams?: string | null;
  pathVariables?: string | null;
}

export interface NodeEndPoint {
  endpointId: string;
  header?: string;
  method: HttpMethod | string;
  path: string;
  baseUrl: string;
  requestSchema?: string;
  responseSchema?: string;
  showBody: boolean;
}
