import React, { useEffect, useState } from 'react';
import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import { ScenarioTestResultFileListItem } from '@/pages/dashboard/types/index.ts';
import { useSearchParams } from 'react-router-dom';
import { useScenarioFileList } from '@/pages/dashboard/hooks/useScenarioFileList.ts';

/**
 * Dashboard component renders the main dashboard layout with sidebar, tabs, and main content.
 * It displays a list of scenario test results and allows selecting and closing tabs.
 *
 * @returns JSX.Element - The rendered dashboard component.
 *
 * @author haerim-kweon
 */
const Dashboard: React.FC = () => {
  const { scenarioFileList, selectedScenario, fetchSelectedScenario, clearSelectedScenario } =
    useScenarioFileList();
  const [searchParams] = useSearchParams();
  const fileName = searchParams.get('fileName');

  const { tabs, selectedTab, selectTab, closeTab, handleSelectItem } = useTabsController<
    ScenarioTestResultFileListItem,
    'fileName',
    'fileName'
  >({
    itemList: scenarioFileList,
    idField: 'fileName',
    titleField: 'fileName',
    onItemSelected: fetchSelectedScenario,
  });

  useEffect(() => {
    if (!fileName || scenarioFileList.length === 0) return;
    const foundItem = scenarioFileList.find(item => item.fileName === fileName);
    if (foundItem) {
      handleSelectItem(foundItem);
    }
  }, [fileName, scenarioFileList, handleSelectItem]);

  useEffect(() => {
    if (tabs.length === 0) {
      clearSelectedScenario();
    }
  }, [tabs]);

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
