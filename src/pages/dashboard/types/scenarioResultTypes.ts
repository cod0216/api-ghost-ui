import { HttpMethod, ProtocolType, HttpRequest } from '@/common/types/apiTypes.ts';

export interface FormData {
  file?: Record<string, string>;
  text?: Record<string, string>;
  json?: object | null;
}

export interface ScenarioTestDetailResponseResult {
  stepName: string;
  type: ProtocolType;
  url: string;
  method: HttpMethod;
  requestBody?: FormData;
  requestHeader?: Record<string, string>;
  responseBody?: object;
  responseHeaders?: Record<string, string>;
  status: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  isRequestSuccess: boolean;
  route?: Route[];
}

export interface ScenarioTestResultFileListResponse {
  resultList: ScenarioTestResultFileListItem[];
}

export interface ScenarioTestResultFileListItem {
  fileName: string;
  testSummary: boolean;
  timeStamp: string;
}

export interface ScenarioTestDetailResponse {
  name: string;
  description: string;
  executedAt: string;
  totalDurationMs: number;
  averageDurationMs: number;
  filePath: string;
  isScenarioSuccess: boolean;
  results: ScenarioTestDetailResponseResult[];
}

export interface ScenarioExportRequest {
  name: string;
  description: string;
  timeoutMs: number;
  store: Record<string, any> | null;
  steps: Record<string, ScenarioStep>;
}

export interface ScenarioStep {
  type: ProtocolType;
  position: Position;
  request?: HttpRequest;
  route: Route[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Route {
  expected: ExpectedResult;
  then: ThenAction | null;
}

export interface ExpectedResult {
  status: string;
  value: Record<string, any> | null;
}

export interface ThenAction {
  store?: Record<string, any>;
  step: string;
}
