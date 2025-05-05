import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import Sidebar from '@/common/sidebar/Sidebar.tsx';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import { mockHistoryList } from './__mocks__/mockHistoryList.ts';

const Dashboard: React.FC = () => {
  const { tabs, selectedTab, selectedHistory, selectTab, closeTab, handleSelectHistory } =
    useTabsController();

  return (
    <div className={styles.container}>
      <Sidebar
        className={styles.sidebar}
        historyList={mockHistoryList}
        onClickItem={handleSelectHistory}
      />
      <HeaderTabs
        className={styles.headerTabs}
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
      />
      <MainContent className={styles.mainContent} history={selectedHistory} />
    </div>
  );
};

export default Dashboard;
