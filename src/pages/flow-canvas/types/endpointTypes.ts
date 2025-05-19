import { HttpMethod, ProtocolType, RequestBody } from '@/common/types/index.ts';
import { FlowRoute } from './scenarioTypes';

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
  isSuccess?: boolean;
  isFail?: boolean;
}

export interface StepResult {
  stepName: string;
  type: ProtocolType;
  method: HttpMethod;
  url: string;
  requestHeader: Record<string, string>;
  requestBody: RequestBody;
  status: number;
  responseHeaders: Record<string, string>;
  responseBody: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  route: FlowRoute[] | null;
  nextStep: string;
  isRequestSuccess: boolean;
}
