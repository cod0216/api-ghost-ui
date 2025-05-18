import { Snapshot, MetricPoint } from '@/pages/load-test/types';

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

// export const extractLineData = (snapshots: Snapshot[], key: keyof Snapshot["result"] & string, subKey: string) => {
//   return snapshots.map((s) => s.result[key]?.[subKey as keyof any]);
// };

export const extractLineData = (
  snapshots: Snapshot[],
  key: keyof Snapshot['result'] & string,
  subKey: string,
): (number | undefined)[] => {
  return snapshots.map(s => {
    const value = s.result[key];

    if (typeof value === 'object' && value !== null && subKey in value) {
      return (value as Record<string, any>)[subKey];
    }

    return undefined;
  });
};

export const extractMetric = (
  snapshots: Snapshot[],
  metricPath: (s: Snapshot) => number,
): MetricPoint[] => {
  return snapshots.map(s => ({
    timestamp: s.timeStamp,
    value: metricPath(s),
  }));
};
