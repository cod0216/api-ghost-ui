import React, { useEffect, useState } from 'react';
import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import { ScenarioTestResultFileListItem } from '@/pages/dashboard/types/index.ts';
import { mockSnapshots } from '@/pages/load-test/mockData';
import { extractMetric } from '@/pages/load-test/utils/loadTestUtils';
import MetricChart from '@/pages/load-test/MetricChart';
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
);
const LoadTest: React.FC = () => {
  const { tabs, selectedTab, selectTab, closeTab, handleSelectItem } = useTabsController<
    ScenarioTestResultFileListItem,
    'fileName',
    'fileName'
  >({
    itemList: [],
    idField: 'fileName',
    titleField: 'fileName',
    onItemSelected: () => {},
  });

  const [snapshots, setSnapshots] = useState(mockSnapshots);

  const rpsPoints = extractMetric(snapshots, s => s.result.http_reqs.rate);
  const latencyPoints = extractMetric(snapshots, s => s.result.http_req_duration.avg);
  const vusPoints = extractMetric(snapshots, s => s.result.vus);

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
      <HeaderTabs
        className={styles.headerTabs}
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
      />
      <div className={styles.mainContent}>
        <MetricChart />
      </div>
    </div>
  );
};

export default LoadTest;
