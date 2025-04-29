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

interface ResultItem {
  endpoint: string;
  method: string;
  requestBody: any;
  requestHeader?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  responseBody: any;
  responseHeaders: Record<string, string>;
  statusCode: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  isRequestSuccess: boolean;
}
