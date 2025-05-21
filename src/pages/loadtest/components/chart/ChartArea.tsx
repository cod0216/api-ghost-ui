import React, { useState, useEffect, useRef } from 'react';
import styles from '@/pages/loadtest/styles/LoadTest.module.scss';
import DataCard from '@/pages/loadtest/components/DataCard';
import ChartCard from '@/pages/loadtest/components/ChartCard';
import LineChart from '@/pages/loadtest/components/chart/LineChart';
import DoughnutChart from '@/pages/loadtest/components/chart/DoughnutChart';
import {
  Snapshot,
  AggregatedResult,
  EndpointResult,
  LoadTestParamInfo,
} from '@/pages/loadtest/types';
import {
  parseSnapshot,
  getDoughnutChartData,
  getBarChartData,
  getLineChartData,
  ParsedSnapshot,
  getEndpointMetrics,
} from '@/pages/loadtest/utils/loadTestUtils';
import { getEventSource } from '@/pages/loadtest/service/loadTestService';

interface ChartAreaProps {
  loadTest: LoadTestParamInfo | null;
  onTest: boolean;
  closeTest: () => void;
}
const ChartArea: React.FC<ChartAreaProps> = ({ loadTest, onTest, closeTest }) => {
  const [lastSnapshot, setLastSnapshot] = useState<Snapshot>();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [timeline, setTimeline] = useState<ParsedSnapshot[]>([]);
  const [endpointResultMap, setEndpointResultMap] = useState<Record<string, EndpointResult[]>>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AggregatedResult | EndpointResult | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const handleSnapshot = (event: MessageEvent) => {
    try {
      const newSnapshot = JSON.parse(event.data) as Snapshot;
      updateChart(newSnapshot);
    } catch (err) {
      console.error('Error parsing snapshot:', err);
      closeTest();
    }
  };

  const handleSummary = (event: MessageEvent) => {
    closeTest();
    eventSourceRef.current?.close();
  };

  useEffect(() => {
    if (!onTest || !loadTest?.fileName) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.removeEventListener('snapshot', handleSnapshot);
      eventSourceRef.current.removeEventListener('summary', handleSummary);

      eventSourceRef.current.close();
    }

    const eventSource = getEventSource(loadTest.fileName);

    eventSourceRef.current = eventSource;

    eventSource.addEventListener('snapshot', handleSnapshot);
    eventSource.addEventListener('summary', handleSummary);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = error => {
      console.error('SSE error:', error);
      setIsConnected(false);
      eventSource.close();
      closeTest();
    };

    return () => {
      eventSource.removeEventListener('snapshot', handleSnapshot);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onTest, loadTest?.fileName]);

  const updateChart = (snapshot: Snapshot) => {
    setSnapshots(prev => {
      const newSnapshots = [...prev, snapshot];
      setTimeline(newSnapshots.map(s => parseSnapshot(s)));

      const updatedResultMap: Record<string, EndpointResult[]> = {};
      newSnapshots.forEach(s => {
        s.endpoints.forEach(item => {
          const url = item.url;
          if (!updatedResultMap[url]) updatedResultMap[url] = [];
          updatedResultMap[url].push(item.result);
        });
      });
      setEndpointResultMap(updatedResultMap);

      return newSnapshots;
    });

    setLastSnapshot(snapshot);
    setResult(snapshot.result);
    setSelectedUrl(null);
  };

  useEffect(() => {
    if (!lastSnapshot) return;

    if (selectedUrl && endpointResultMap[selectedUrl]?.length > 0) {
      const latestEndpointResult = endpointResultMap[selectedUrl].at(-1);
      if (latestEndpointResult) {
        setResult(latestEndpointResult);
      }
    } else {
      setResult(lastSnapshot.result);
    }
  }, [selectedUrl, endpointResultMap, lastSnapshot]);

  const duration = result?.http_req_duration;

  return (
    <div className={styles.chartArea}>
      {Object.keys(endpointResultMap).length > 0 && (
        <div className={styles.endpointSelector}>
          <label>API Select: </label>
          <select value={selectedUrl || ''} onChange={e => setSelectedUrl(e.target.value || null)}>
            <option value="">Total</option>
            {Object.keys(endpointResultMap).map((url, idx) => (
              <option key={idx} value={url}>
                {url}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.dataRow}>
        <DataCard
          className={styles.dataField}
          title="Virtual Users"
          value={result?.vus.toString()}
        />
        <DataCard
          className={styles.dataField}
          title="Total Requests"
          value={result?.http_reqs.count.toLocaleString()}
        />
        <DataCard
          className={styles.dataField}
          title="RPS"
          value={result?.http_reqs.rate.toFixed(2)}
        />
        <DataCard
          className={styles.dataField}
          title="Avg. Response Time"
          value={duration?.avg ? `${duration.avg}ms` : ''}
        />
      </div>

      {/* Success/Failure rate */}
      <div className={styles.chartRow}>
        {/* VUs over time */}
        <ChartCard className={styles.chartCard} title="VUs">
          <LineChart data={getLineChartData('vus', timeline)} />
        </ChartCard>
      </div>

      {/* Request/Error rate charts */}
      <div className={styles.chartRow}>
        <ChartCard className={styles.chartCard} title="Success/Failure Rate">
          {lastSnapshot && <DoughnutChart data={getDoughnutChartData(lastSnapshot)} />}
        </ChartCard>
      </div>

      {/* Response time charts */}
      <div className={styles.chartRow}>
        <ChartCard className={styles.chartCard} title="HTTP Response Time">
          <LineChart data={getLineChartData('avgDuration', timeline)} />
        </ChartCard>
      </div>

      {/* Response time percentiles table */}
      <div className={styles.dataField}>
        <h3>HTTP Response Time Percentiles</h3>
        <table className={styles.percentileTable}>
          <thead>
            <tr>
              <th>Percentile</th>
              <th>Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Min</td>
              <td>{duration?.min}</td>
            </tr>
            <tr>
              <td>Max</td>
              <td>{duration && duration.max}</td>
            </tr>
            <tr>
              <td>Median</td>
              <td>{duration?.med}</td>
            </tr>
            <tr>
              <td>Avg</td>
              <td>{duration && duration.avg}</td>
            </tr>
            <tr>
              <td>P90</td>
              <td>{duration && duration['p(90)']}</td>
            </tr>
            <tr>
              <td>P95</td>
              <td>{duration && duration['p(95)']}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Endpoint metrics */}
      {Object.keys(endpointResultMap).length > 0 && (
        <div className={styles.dataField}>
          <h3>Endpoint Performance</h3>
          <table className={styles.endpointTable}>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Request</th>
                <th>Failure (%)</th>
                <th>min (ms)</th>
                <th>max (ms)</th>
                <th>median (ms)</th>
                <th>avg (ms)</th>
                <th>p90 (ms)</th>
                <th>p95 (ms)</th>
              </tr>
            </thead>
            <tbody>
              {getEndpointMetrics(endpointResultMap).map((endpoint, index) => (
                <tr key={index}>
                  <td>{endpoint.url}</td>
                  <td>{endpoint.requests}</td>
                  <td>{endpoint.failRate.toFixed(2)}%</td>
                  <td>{endpoint.minDuration}</td>
                  <td>{endpoint.maxDuration}</td>
                  <td>{endpoint.medDuration}</td>
                  <td>{endpoint.avgDuration}</td>
                  <td>{endpoint.p90}</td>
                  <td>{endpoint.p95}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChartArea;
