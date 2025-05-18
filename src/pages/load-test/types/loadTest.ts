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

export interface EndpointResult {
  url: string;
  result: {
    http_reqs: RateCount;
    http_req_duration: DurationStats;
    http_req_failed: FailStats;
    vus: number;
  };
}
export interface MetricPoint {
  timestamp: string;
  value: number;
}
