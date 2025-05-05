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
      <div className={styles.sidebar}>
        <Sidebar historyList={mockHistoryList} onClickItem={handleSelectHistory} />
      </div>
      <div className={styles.headerTabs}>
        <HeaderTabs
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={selectTab}
          onCloseTab={closeTab}
        />
      </div>
      <div className={styles.mainContent}>
        <MainContent history={selectedHistory} />
      </div>
    </div>
  );
};

export default Dashboard;
