import React from 'react';
import styles from '@/pages/load-test/styles/LoadTest.module.scss';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import DataCard from '@/pages/load-test/components/DataCard';
import ChartCard from '@/pages/load-test/components/ChartCard';
import LineChart from '@/pages/load-test/components/LineChart';
import BarChart from '@/pages/load-test/components/BarChart';
import DoughnutChart from '@/pages/load-test/components/DoughnutChart';
import {
  failureRateSummaryData,
  requestRateData,
  responseTimeTrendData,
  responseTimeDistData,
  vusData,
  failureRateTrendData,
} from './__mock__';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
);

const LoadTest: React.FC = () => {
  return (
    <div className={styles.container}>
      <CommonSidebar
        className={`${styles.sidebar}`}
        sections={[
          {
            title: 'Load Test',
            content: <div className={styles.scenarioListContainer}></div>,
          },
        ]}
      />
      <div className={styles.contentArea}>
        <div className={styles.dataRow}>
          <DataCard className={styles.dataField} title="Total Request" value="456,456" />
          <DataCard className={styles.dataField} title="Total Failure" value="1,234" />
          <DataCard className={styles.dataField} title="Avg. Response Time" value="8,000 ms" />
          <DataCard className={styles.dataField} title="Test Duration" value="90s" />
        </div>

        <ChartCard className={styles.chartCard} title="Request Per Second">
          <LineChart data={requestRateData} />
        </ChartCard>

        <ChartCard className={styles.chartCard} title="Response Time Trend">
          <LineChart data={responseTimeTrendData} />
        </ChartCard>

        <ChartCard className={styles.chartCard} title="Response Time Distribution">
          <BarChart data={responseTimeDistData} />
        </ChartCard>

        <div className={styles.chartRow}>
          <ChartCard className={styles.chartCard} title="Failure Rate">
            <DoughnutChart data={failureRateSummaryData} />
          </ChartCard>
          <ChartCard className={styles.chartCard} title="VUs Over Time">
            <LineChart data={vusData} />
          </ChartCard>
        </div>

        <div className={styles.dataField}>
          <h4>Latency Percentiles</h4>
          <table className={styles.percentileTable}>
            <thead>
              <tr>
                <th>Percentile</th>
                <th>Duration (ms)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>min</td>
                <td>3200</td>
              </tr>
              <tr>
                <td>median</td>
                <td>7100</td>
              </tr>
              <tr>
                <td>p(90)</td>
                <td>12500</td>
              </tr>
              <tr>
                <td>p(95)</td>
                <td>18300</td>
              </tr>
              <tr>
                <td>max</td>
                <td>26400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadTest;
