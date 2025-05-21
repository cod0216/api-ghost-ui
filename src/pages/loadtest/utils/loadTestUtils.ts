import {
  Snapshot,
  HttpReqDuration,
  AggregatedResult,
  EndpointResult,
} from '@/pages/loadtest/types';

export interface ParsedSnapshot {
  timestamp: string;
  vus: number;
  rps: number;
  failRate: number;
  checksRate: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  medDuration: number;
  p90Duration: number;
  p95Duration: number;
}

export const parseSnapshot = (snapshot: Snapshot): ParsedSnapshot => {
  const result = snapshot.result;
  const httpDuration = result.http_req_duration;

  return {
    timestamp: formatTimestamp(snapshot.timeStamp),
    vus: result.vus,
    rps: result.http_reqs.rate,
    failRate: result.http_req_failed.rate,
    checksRate: 0,
    avgDuration: httpDuration.avg,
    maxDuration: httpDuration.max,
    minDuration: httpDuration.min,
    medDuration: httpDuration.med,
    p90Duration: httpDuration['p(90)'],
    p95Duration: httpDuration['p(95)'],
  };
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const getDoughnutChartData = (snapshot: Snapshot) => {
  const result = snapshot.result;
  const success = result.http_reqs.count - result.http_req_failed.fail;
  const failure = result.http_req_failed.fail;

  return {
    labels: ['Success', 'Failure'],
    datasets: [
      {
        data: [success, failure],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
        borderWidth: 1,
      },
    ],
  };
};

export const getBarChartData = (duration: HttpReqDuration | undefined) => {
  if (!duration) return;
  return {
    labels: ['Min', 'Median', 'P90', 'P95', 'Max'],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [duration.min, duration.med, duration['p(90)'], duration['p(95)'], duration.max],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

export const getLineChartData = (metricType: string, timeline: ParsedSnapshot[]) => {
  const labels = timeline.map(item => item.timestamp);

  switch (metricType) {
    case 'vus':
      return {
        labels,
        datasets: [
          {
            label: 'Virtual Users',
            data: timeline.map(item => item.vus),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Requests Per Second',
            data: timeline.map(item => item.rps),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

    // case 'rps':
    //   return {
    //     labels,
    //     datasets: [
    //       {
    //         label: 'Requests Per Second',
    //         data: timeline.map(item => item.rps),
    //         borderColor: 'rgba(54, 162, 235, 1)',
    //         backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //         tension: 0.4,
    //         fill: true,
    //       },
    //     ],
    //   };

    case 'errorRate':
      return {
        labels,
        datasets: [
          {
            label: 'Error Rate',
            data: timeline.map(item => item.failRate * 100), // Convert to percentage
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Checks Rate',
            data: timeline.map(item => item.checksRate),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

    case 'avgDuration':
      return {
        labels,
        datasets: [
          {
            label: 'Avg Duration',
            data: timeline.map(item => item.avgDuration),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
          },
          {
            label: 'Median',
            data: timeline.map(item => item.medDuration),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
          },
          {
            label: 'P90',
            data: timeline.map(item => item.p90Duration),
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
          },
          {
            label: 'P95',
            data: timeline.map(item => item.p95Duration),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
          },
        ],
      };

    default:
      return {
        labels,
        datasets: [],
      };
  }
};

// Optional: Function to compute metrics for specific endpoints
export const getEndpointMetrics = (endpointResultMap: Record<string, EndpointResult[]>) => {
  const endpoints = Object.keys(endpointResultMap);

  return endpoints.map(endpoint => {
    const results = endpointResultMap[endpoint];
    const lastResult = results[results.length - 1];

    return {
      url: endpoint,
      requests: lastResult.http_reqs.count,
      failRate: lastResult.http_req_failed.rate * 100,
      minDuration: lastResult.http_req_duration.min,
      maxDuration: lastResult.http_req_duration.max,
      medDuration: lastResult.http_req_duration.med,
      avgDuration: lastResult.http_req_duration.avg,
      p90: lastResult.http_req_duration['p(90)'],
      p95: lastResult.http_req_duration['p(95)'],
    };
  });
};
