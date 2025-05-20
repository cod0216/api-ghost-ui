import React, { useState, useEffect, useRef } from 'react';
import styles from '@/pages/loadtest/styles/LoadTest.module.scss';
import DataCard from '@/pages/loadtest/components/DataCard';
import ChartCard from '@/pages/loadtest/components/ChartCard';
import LineChart from '@/pages/loadtest/components/chart/LineChart';
import BarChart from '@/pages/loadtest/components/chart/BarChart';
import DoughnutChart from '@/pages/loadtest/components/chart/DoughnutChart';
import {
  Snapshot,
  HttpReqDuration,
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

interface ChartAreaProps {
  loadTest: LoadTestParamInfo | null;
  onTest: boolean;
}
const ChartArea: React.FC<ChartAreaProps> = ({ loadTest, onTest }) => {
  const [lastSnapshot, setLastSnapshot] = useState<Snapshot>();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [timeline, setTimeline] = useState<ParsedSnapshot[]>([]);
  const [endpointResultMap, setEndpointResultMap] = useState<Record<string, EndpointResult[]>>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AggregatedResult | EndpointResult | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!onTest || !loadTest?.fileName) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `http://localhost:7000/apighost/loadtest-execute?loadTestParam=${loadTest.fileName}`,
    );
    eventSourceRef.current = eventSource;

    const handleSnapshot = (event: MessageEvent) => {
      try {
        const newSnapshot = JSON.parse(event.data) as Snapshot;
        updateChart(newSnapshot);
      } catch (err) {
        console.error('Error parsing snapshot:', err);
      }
    };

    eventSource.addEventListener('snapshot', handleSnapshot);
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = error => {
      console.error('SSE error:', error);
      setIsConnected(false);
      eventSource.close();
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
          value={`${duration && duration.avg && duration.avg.toFixed(2)} ms`}
        />
      </div>

      {/* Success/Failure rate */}
      <div className={styles.chartRow}>
        <ChartCard className={styles.chartCard} title="Success/Failure Rate">
          {lastSnapshot && <DoughnutChart data={getDoughnutChartData(lastSnapshot)} />}
        </ChartCard>

        {/* VUs over time */}
        <ChartCard className={styles.chartCard} title="Virtual Users Over Time">
          <LineChart data={getLineChartData('vus', timeline)} />
        </ChartCard>
      </div>

      {/* Request/Error rate charts */}
      <div className={styles.chartRow}>
        <ChartCard className={styles.chartCard} title="Requests Per Second">
          <LineChart data={getLineChartData('rps', timeline)} />
        </ChartCard>

        <ChartCard className={styles.chartCard} title="Error Rate & Checks">
          <LineChart data={getLineChartData('errorRate', timeline)} />
        </ChartCard>
      </div>

      {/* Response time charts */}
      <div className={styles.chartRow}>
        <ChartCard className={styles.chartCard} title="HTTP Response Time">
          <LineChart data={getLineChartData('avgDuration', timeline)} />
        </ChartCard>

        <ChartCard className={styles.chartCard} title="Response Time Distribution">
          <BarChart data={getBarChartData(duration)} />
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
              <td>{duration?.min.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Median</td>
              <td>{duration?.med.toFixed(2)}</td>
            </tr>
            <tr>
              <td>P90</td>
              <td>{duration && duration['p(90)'].toFixed(2)}</td>
            </tr>
            <tr>
              <td>P95</td>
              <td>{duration && duration['p(95)'].toFixed(2)}</td>
            </tr>
            <tr>
              <td>Max</td>
              <td>{duration && duration.max.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Avg</td>
              <td>{duration && duration.avg.toFixed(2)}</td>
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
                <th>Requests</th>
                <th>Failure Rate (%)</th>
                <th>Avg. Duration (ms)</th>
              </tr>
            </thead>
            <tbody>
              {getEndpointMetrics(endpointResultMap).map((endpoint, index) => (
                <tr key={index}>
                  <td>{endpoint.url}</td>
                  <td>{endpoint.requests}</td>
                  <td>{endpoint.failRate.toFixed(2)}%</td>
                  <td>{endpoint.avgDuration.toFixed(2)}</td>
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
