export interface Snapshot {
  timeStamp: string;
  result: AggregatedResult;
  endpoint: EndpointResult[];
}

export interface AggregatedResult {
  iterations: RateCount;
  http_reqs: RateCount;
  http_req_duration: DurationStats;
  http_req_failed: FailStats;
  vus: number;
}

export interface RateCount {
  rate: number;
  count: number;
}

export interface DurationStats {
  avg: number;
  min: number;
  med: number;
  max: number;
  'p(90)': number;
  'p(95)': number;
}

export interface FailStats {
  count: number;
  fail: number;
  rate: number;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface HttpReqDuration {
  avg: number;
  min: number;
  med: number;
  max: number;
  p90: number;
  p95: number;
}
// 타입 정의
interface HttpReqs {
  rate: number;
  count: number;
}

interface HttpReqFailed {
  count: number;
  fail: number;
  rate: number;
}

interface Iterations {
  rate: number;
  count: number;
}

interface EndpointResult {
  http_reqs: HttpReqs;
  http_req_duration: HttpReqDuration;
  http_req_failed: HttpReqFailed;
  vus: number;
}

interface Endpoint {
  url: string;
  result: EndpointResult;
}

interface TestResult {
  iterations: Iterations;
  http_reqs: HttpReqs;
  http_req_duration: HttpReqDuration;
  http_req_failed: HttpReqFailed;
  vus: number;
}

interface LoadTestData {
  timeStamp: string;
  result: TestResult;
  endpoint: Endpoint[];
}
