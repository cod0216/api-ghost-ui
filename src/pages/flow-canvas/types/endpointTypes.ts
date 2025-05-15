import { HttpMethod, ProtocolType } from '@/common/types/index.ts';

export interface Field {
  type: string;
  name: string;
  nestedFields?: Field[];
  value?: string | number | boolean;
}

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
  requestSchema: Field[] | null;
  responseSchema: Field[] | null;
  headers?: { key: string; value: string }[] | null;
  cookies?: { key: string; value: string }[] | null;
  requestParams?: { key: string; value: string }[] | null;
  pathVariables?: { key: string; value: string }[] | null;
}

export interface NodeEndPoint {
  endpointId: string;
  header?: Record<string, string>;
  method: HttpMethod | string;
  path: string;
  baseUrl: string;
  requestSchema?: Field[];
  responseSchema?: Field[];
  showBody: boolean;
}
