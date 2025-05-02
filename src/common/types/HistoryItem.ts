export interface HistoryItem {
  id: string;
  title: string;
  description: string;
  executedAt: string;
  totalDurationMs: number;
  averageDurationMs: number;
  filePath: string;
  baseUrl: string;
  isScenarioSuccess: boolean;
  results: ResultItem[];
}

export interface ResultItem {
  endpoint: string;
  method: string;
  requestBody?: object;
  requestHeader?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  responseBody?: object;
  responseHeaders: Record<string, string>;
  statusCode: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  isRequestSuccess: boolean;
}
