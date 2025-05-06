import styles from '@/pages/dashboard/styles/Dashboard.module.scss';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import CommonSidebar from '@/common/components/CommonSidebar.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import { mockHistoryList } from './__mocks__/mockHistoryList.ts';

const Dashboard: React.FC = () => {
  const { tabs, selectedTab, selectedList, selectTab, closeTab, handleSelectList } =
    useTabsController(mockHistoryList);

  return (
    <div className={styles.container}>
      <CommonSidebar
        className={`${styles.sidebar}`}
        sections={[
          {
            title: 'History',
            content: (
              <div className={styles.historyContainer}>
                {mockHistoryList.map(item => (
                  <div
                    className={styles.historyItem}
                    key={item.id}
                    onClick={() => handleSelectList(item)}
                  >
                    {item.title}
                  </div>
                ))}
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
      <MainContent className={styles.mainContent} history={selectedList} />
    </div>
  );
};

export default Dashboard;
