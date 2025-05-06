import { HttpMethod, ProtocolType } from './apiTypes.ts';

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
  statusCode: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  isRequestSuccess: boolean;
  route?: Array<{
    expected: {
      status: string;
      value: Record<string, string>;
    };
    then: {
      store: {
        variableName: string;
      };
      step: string;
    };
  }>;
}

export interface ScenarioTestResultFileListItem {
  fileName: string;
  testSummary: string;
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
