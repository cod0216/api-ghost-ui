import { useState } from 'react';
import { TabsController } from '@/pages/dashboard/controllers/TabsController.ts';
import { TabItem } from '@/common/types/index.ts';

export const useTabsController = <T extends { id: string; title: string }>(itemList: T[]) => {
  const [controller] = useState(() => new TabsController(itemList));
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<T | null>(null);

  const updateTabsAndSelection = () => {
    const updatedTabs = controller.getTabs();
    const currentTab = controller.getSelectedTab();
    const currentHistory = currentTab ? (itemList.find(h => h.id === currentTab.id) ?? null) : null;

    setTabs([...updatedTabs]);
    setSelectedTab(currentTab);
    setSelectedList(currentHistory);
  };

  const selectTab = (id: string) => {
    controller.selectTab(id);
    updateTabsAndSelection();
  };

  const addTab = (tab: TabItem) => {
    controller.addTab(tab);
    updateTabsAndSelection();
  };

  const closeTab = (id: string) => {
    controller.closeTab(id);
    updateTabsAndSelection();
  };

  const handleSelectList = (item: T) => {
    const exists = tabs.find(tab => tab.id === item.id);
    if (exists) {
      selectTab(item.id);
    } else {
      addTab({ id: item.id, title: item.title });
    }
  };

  return {
    tabs,
    selectedTab,
    selectedList,
    selectTab,
    addTab,
    closeTab,
    handleSelectList,
  };
};
