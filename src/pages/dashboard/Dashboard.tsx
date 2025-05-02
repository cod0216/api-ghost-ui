/**
 * Dashboard component
 *
 * This component represents the main dashboard layout which includes a sidebar, header tabs, and main content area.
 * The dashboard allows users to select a history item to view its content, manage multiple tabs, and interact with the UI elements.
 * It uses a custom hook for managing tabs and interacts with a list of history items.
 *
 * @fileoverview Displays the dashboard layout with a sidebar, header tabs, and main content section.
 * The component handles tab management (selecting, adding, and closing tabs) and history item selection.
 */

import { useState } from 'react';
import styles from './Dashboard.module.scss';
import Sidebar from '@/common/sidebar/Sidebar.tsx';
import MainContent from '@/pages/dashboard/components/main-content/MainContent.tsx';
import HeaderTabs from '@/pages/dashboard/components/header-tabs/HeaderTabs.tsx';
import { useTabsController } from '@/pages/dashboard/hooks/useTabsController.ts';
import { HistoryItem } from '@/common/types/index.ts';
import { mockHistoryList } from './__mocks__/mockHistoryList.ts';

/**
 * Dashboard component
 *
 * This component renders the overall dashboard UI, including the Sidebar, HeaderTabs, and MainContent.
 * It manages the state of selected tabs and history items and allows the user to interact with the UI to select and close tabs.
 */
const Dashboard: React.FC = () => {
  // Using the custom hook to manage tabs
  const { selectedTab, selectTab, addTab, tabs, closeTab } = useTabsController();

  // State to manage the currently selected history item
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  /**
   * Handles the selection of a history item.
   * When a history item is selected, a new tab is added, and the selected history is updated.
   *
   * @param item - The history item to be selected.
   */
  const handleSelectHistory = (item: HistoryItem) => {
    addTab({ id: item.id, title: item.title }); // Add a new tab for the selected history item
    setSelectedHistory(item); // Set the selected history item
  };

  /**
   * Handles the selection of a tab.
   * When a tab is selected, the selected tab is updated, and the corresponding history item is set.
   *
   * @param id - The id of the tab to be selected.
   */
  const handleSelectTab = (id: string) => {
    selectTab(id); // Select the tab with the given id
    const tab = tabs.find(tab => tab.id === id); // Find the tab by id
    if (tab) {
      // Find the corresponding history item for the selected tab
      const matched = mockHistoryList.find(h => h.id === id);
      if (matched) setSelectedHistory(matched); // Update the selected history
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {/* Sidebar displaying history items */}
        <Sidebar historyList={mockHistoryList} onClickItem={handleSelectHistory} />
      </div>
      <div className={styles.headerTabs}>
        {/* HeaderTabs to manage tab selection and closing */}
        <HeaderTabs
          selectedTab={selectedTab}
          onSelectTab={handleSelectTab}
          tabs={tabs}
          onCloseTab={closeTab}
        />
      </div>
      <div className={styles.mainContent}>
        {/* MainContent displaying the selected history item */}
        <MainContent history={selectedHistory} />
      </div>
    </div>
  );
};

export default Dashboard;
