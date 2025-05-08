import React, { useEffect, useState } from 'react';
import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import {
  ScenarioTestResultFileListItem,
  ScenarioTestDetailResponse,
} from '@/pages/dashboard/types/index.ts';
import {
  getScenarioResultList,
  getScenarioDetailResult,
} from '@/pages/dashboard/service/resultService.ts';
import { useSearchParams } from 'react-router-dom';

/**
 * Dashboard component renders the main dashboard layout with sidebar, tabs, and main content.
 * It displays a list of scenario test results and allows selecting and closing tabs.
 *
 * @returns JSX.Element - The rendered dashboard component.
 *
 * @author haerim-kweon
 */
const Dashboard: React.FC = () => {
  const [scenarioFileList, setScenarioFileList] = useState<ScenarioTestResultFileListItem[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioTestDetailResponse | null>(null);
  const [searchParams] = useSearchParams();
  const fileName = searchParams.get('fileName');

  const onItemSelected = async (item: ScenarioTestResultFileListItem) => {
    try {
      const response = await getScenarioDetailResult(item.fileName);
      setSelectedScenario(response);
    } catch (err) {
      console.error('[Dashboard] getScenarioDetailResult Error', err);
    }
  };

  useEffect(() => {
    getScenarioResultList()
      .then(setScenarioFileList)
      .catch(err => console.error('[Dashboard] getScenarioResultList Error', err));
  }, []);

  const { tabs, selectedTab, selectTab, closeTab, handleSelectItem } = useTabsController<
    ScenarioTestResultFileListItem,
    'fileName',
    'fileName'
  >({
    itemList: scenarioFileList,
    idField: 'fileName',
    titleField: 'fileName',
    onItemSelected,
  });

  useEffect(() => {
    if (!fileName || scenarioFileList.length === 0) return;
    const foundItem = scenarioFileList.find(item => item.fileName === fileName);
    if (foundItem) {
      handleSelectItem(foundItem);
    }
  }, [fileName, scenarioFileList]);

  return (
    <div className={styles.container}>
      <CommonSidebar
        className={`${styles.sidebar}`}
        sections={[
          {
            title: 'History',
            content: (
              <div className={styles.scenarioListContainer}>
                {scenarioFileList.map(item => {
                  const isSelected = item.fileName === selectedTab?.id;
                  return (
                    <div
                      data-selected={isSelected}
                      data-testid={`sidebar-item-${item.fileName}`}
                      className={`${styles.scenarioListItem} ${isSelected ? styles.selectedScenarioListItem : ''}`}
                      key={item.fileName}
                      onClick={() => handleSelectItem(item)}
                    >
                      {item.fileName}
                    </div>
                  );
                })}
              </div>
            ),
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
      <MainContent className={styles.mainContent} scenarioTestResult={selectedScenario} />
    </div>
  );
};

export default Dashboard;
