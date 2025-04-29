import { useState } from 'react';
import styles from './Dashboard.module.scss';
import Sidebar from '@/pages/dashboard/sidebar/Sidebar.tsx';
import MainContent from '@/pages/dashboard/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/header-tabs/HeaderTabs.tsx';
import { useTabsController } from '@/hooks/useTabsController.ts';
import { HistoryItem } from '@/types/index.ts';
import { mockHistoryList } from './__mocks__/mockHistoryList.ts';

const Dashboard: React.FC = () => {
  const { selectedTab, selectTab, addTab, tabs, closeTab } = useTabsController();
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const handleSelectHistory = (item: HistoryItem) => {
    addTab({ id: item.id, title: item.title });
    setSelectedHistory(item);
  };

  const handleSelectTab = (id: string) => {
    selectTab(id);
    const tab = tabs.find(tab => tab.id === id);
    if (tab) {
      const matched = mockHistoryList.find(h => h.id === id);
      if (matched) setSelectedHistory(matched);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar historyList={mockHistoryList} onClickItem={handleSelectHistory} />
      </div>
      <div className={styles.headerTabs}>
        <HeaderTabs
          selectedTab={selectedTab}
          onSelectTab={handleSelectTab}
          tabs={tabs}
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
