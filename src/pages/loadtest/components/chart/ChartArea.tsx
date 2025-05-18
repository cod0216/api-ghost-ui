import React, { useState, useEffect } from 'react';
import styles from '@/pages/load-test/styles/LoadTest.module.scss';
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
// import { snaptshat as mockSnapshat } from '../../__mock__';

const POLL_INTERVAL = 5000;

interface ChartAreaProps {
  loadTest: LoadTestParamInfo | null;
  onTest: boolean;
}

const ChartArea: React.FC<ChartAreaProps> = ({ loadTest, onTest }) => {
  if (!onTest || !loadTest) return <></>;
  const [lastSnapshot, setLastSnapshot] = useState<Snapshot>();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [timeline, setTimeline] = useState<ParsedSnapshot[]>([]);
  const [endpointResultMap, setEndpointResultMap] = useState<Record<string, EndpointResult[]>>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // useEffect(() => {
  //   if (lastSnapshot) {
  //     const parsedSnapshot = parseSnapshot(lastSnapshot);
  //     setTimeline([parsedSnapshot]);
  //   }
  // }, []);

  useEffect(() => {
    if (snapshots.length === 0 || !lastSnapshot) return;

    const updatedTimeline = snapshots.map(snapshot => parseSnapshot(snapshot));
    setTimeline(updatedTimeline);

    const updatedResultMap: Record<string, EndpointResult[]> = { ...endpointResultMap };

    lastSnapshot.endpoints.forEach(item => {
      const url = item.url;
      if (!updatedResultMap[url]) {
        updatedResultMap[url] = [];
      }
      updatedResultMap[url] = [...updatedResultMap[url], item.result];
    });

    setEndpointResultMap(updatedResultMap);
  }, [snapshots, lastSnapshot]);

  useEffect(() => {
    const setupSSE = () => {
      try {
        const eventSource = new EventSource(
          `http://localhost:7000/apighost/loadtest-execute?loadTestParam=${loadTest.fileName}`,
        );

        eventSource.onopen = () => {
          console.log('SSE connection opened');
          setIsConnected(true);
        };

        eventSource.addEventListener('snapshot', event => {
          try {
            const newSnapshot = JSON.parse(event.data) as Snapshot;
            console.log(newSnapshot);
            setLastSnapshot(newSnapshot);
            setSnapshots(prev => [...prev, newSnapshot]);
          } catch (err) {
            console.error('Error parsing SSE data:', err);
          }
        });

        eventSource.addEventListener('summary', event => {
          try {
            const summary = JSON.parse(event.data);
            console.log('Load test summary:', summary);
          } catch (err) {
            console.error('Error parsing SSE summary data:', err);
          }
        });

        eventSource.onerror = error => {
          console.error('SSE connection error:', error);
          setIsConnected(false);
          eventSource.close();
          setTimeout(setupSSE, POLL_INTERVAL);
        };

        return () => {
          eventSource.close();
        };
      } catch (err) {
        console.error('Failed to establish SSE connection:', err);

        const interval = setInterval(() => {
          if (!lastSnapshot) return;

          setLastSnapshot(lastSnapshot);
          setSnapshots(prev => [...prev, lastSnapshot]);
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
      }
    };

    setupSSE();
  }, [loadTest]);

  if (!lastSnapshot) return <></>;
  const result: AggregatedResult = lastSnapshot.result;
  const duration: HttpReqDuration = result.http_req_duration;

  return (
    <div className={styles.chartArea}>
      {/* Top metrics cards */}
      <div className={styles.dataRow}>
        <DataCard
          className={styles.dataField}
          title="Virtual Users"
          value={result.vus.toString()}
        />
        <DataCard
          className={styles.dataField}
          title="Total Requests"
          value={result.http_reqs.count.toLocaleString()}
        />
        <DataCard
          className={styles.dataField}
          title="RPS"
          value={result.http_reqs.rate.toFixed(2)}
        />
        <DataCard
          className={styles.dataField}
          title="Avg. Response Time"
          value={`${duration.avg.toFixed(2)} ms`}
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
              <td>{duration.min.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Median</td>
              <td>{duration.med.toFixed(2)}</td>
            </tr>
            <tr>
              <td>P90</td>
              <td>{duration['p(90)'].toFixed(2)}</td>
            </tr>
            <tr>
              <td>P95</td>
              <td>{duration['p(95)'].toFixed(2)}</td>
            </tr>
            <tr>
              <td>Max</td>
              <td>{duration.max.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Avg</td>
              <td>{duration.avg.toFixed(2)}</td>
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
