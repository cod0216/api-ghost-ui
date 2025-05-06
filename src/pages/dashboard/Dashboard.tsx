import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import {
  ScenarioTestResultFileListItem,
  ScenarioTestDetailResponse,
} from '@/common/types/index.ts';

const Dashboard: React.FC = () => {
  const scenarioFileList: ScenarioTestResultFileListItem[] = [];
  const selectedScenario: ScenarioTestDetailResponse | null = null;

  const onItemSelected = (item: any) => {
    console.log(item);
  };

  const { tabs, selectedTab, selectTab, closeTab, handleSelectItem } = useTabsController<
    ScenarioTestResultFileListItem,
    'fileName',
    'fileName'
  >({
    itemList: scenarioFileList,
    idField: 'fileName',
    titleField: 'fileName',
    onItemSelected: onItemSelected,
  });

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
