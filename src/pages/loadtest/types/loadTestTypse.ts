export interface LoadTestParamExcuteResponse {}

export interface LoadTestParamNameResponse {
  loadTestParamNameList: LoadTestParamName[];
}

export interface LoadTestParamName {
  fileName: string;
}

export interface LoadTestParamInfo {
  fileName: string;
  name: string;
  description: string;
  loadTest: LoadTest;
  scenarios: string[];
}

export interface LoadTest {
  timeoutMs: number;
  thinkTimeMs: number;
  loadPattern: Stage[];
}

export interface Stage {
  vus: number;
  duration: number;
}

export interface Snapshot {
  timeStamp: string;
  result: AggregatedResult;
  endpoints: Endpoint[];
}

export interface AggregatedResult extends EndpointResult {
  iterations: HttpReqs;
}

export interface HttpReqs {
  rate: number;
  count: number;
}

export interface HttpReqDuration {
  avg: number;
  min: number;
  med: number;
  max: number;
  'p(90)': number;
  'p(95)': number;
}

export interface HttpReqFailed {
  count: number;
  fail: number;
  rate: number;
}

export interface Endpoint {
  url: string;
  result: EndpointResult;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface LoadTestRawData {
  timeStamp: string;
  result: AggregatedResult;
  endpoint: {
    url: string;
    result: EndpointResult;
  }[];
}

export interface EndpointResult {
  http_reqs: HttpReqs;
  http_req_duration: HttpReqDuration;
  http_req_failed: HttpReqFailed;
  vus: number;
}

export interface CreateLoadTestRequest {
  fileName: string;
  name: string;
  description: string;
  thinkTimeMs: number;
  stage: Stage[];
  scenarios: string[];
}
