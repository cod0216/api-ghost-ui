import { useState } from 'react';
import { TabsController } from '@/pages/dashboard/controllers/TabsController.ts';
import { TabItem, HistoryItem } from '@/common/types/index.ts';
import { mockHistoryList } from '@/pages/dashboard/__mocks__/mockHistoryList.ts';

export const useTabsController = () => {
  const [controller] = useState(() => new TabsController());
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const selectTab = (id: string) => {
    controller.selectTab(id);
    const tab = controller.getSelectedTab();
    setSelectedTab(tab);
    const matched = mockHistoryList.find(h => h.id === id);
    if (matched) setSelectedHistory(matched);
  };

  const addTab = (tab: TabItem) => {
    controller.addTab(tab);
    const updatedTabs = controller.getTabs();
    setTabs([...updatedTabs]);
    setSelectedTab(controller.getSelectedTab());

    const matched = mockHistoryList.find(h => h.id === tab.id);
    if (matched) setSelectedHistory(matched);
  };

  const closeTab = (id: string) => {
    controller.closeTab(id);
    const updatedTabs = controller.getTabs();
    setTabs([...updatedTabs]);
    const selected = controller.getSelectedTab();
    setSelectedTab(selected);

    const matched = selected ? mockHistoryList.find(h => h.id === selected.id) : null;
    setSelectedHistory(matched ?? null);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    addTab({ id: item.id, title: item.title });
  };

  return {
    tabs,
    selectedTab,
    selectedHistory,
    selectTab,
    addTab,
    closeTab,
    handleSelectHistory,
  };
};
