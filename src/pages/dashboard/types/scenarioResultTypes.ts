import { HttpMethod, ProtocolType, HttpRequest } from '@/common/types/apiTypes.ts';

export interface ScenarioTestDetailResponseResult extends ScenarioTestBase {
  isRequestSuccess: boolean;
  route?: Route[];
  nextStep?: string | null;
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
  baseUrl: string;
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

export interface ScenarioTest extends ScenarioTestBase {
  route: string | null;
  nextStep: string | null;
  requestSuccess: boolean;
}

export interface ApiFlowResult {
  name: string;
  description: string;
  executedAt: string;
  totalDurationMs: number;
  averageDurationMs: number;
  filePath: string;
  baseUrl: string;
  results: ScenarioTest[];
  scenarioSuccess: boolean;
}

export interface FormData {
  file?: Record<string, string>;
  text?: Record<string, string>;
  json?: string | null;
}

interface ScenarioTestBase {
  stepName: string;
  type: ProtocolType;
  url: string;
  method: HttpMethod;
  requestBody?: FormData | null;
  requestHeader?: Record<string, string>;
  responseBody?: string;
  responseHeaders?: Record<string, string> | null;
  status: number;
  startTime: string;
  endTime: string;
  durationMs: number;
}
