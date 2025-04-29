import { useState } from 'react';
import { TabsController } from '@/controllers/TabsController.ts';
import { TabItem } from '@/types/index.ts';

export const useTabsController = () => {
  const [controller] = useState(() => new TabsController());
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined);

  const selectTab = (id: string) => {
    controller.selectTab(id);
    setSelectedTab(controller.getSelectedTab());
  };

  const addTab = (tab: TabItem) => {
    controller.addTab(tab);
    setTabs([...controller.getTabs()]);
    setSelectedTab(controller.getSelectedTab());
  };

  const closeTab = (id: string) => {
    controller.closeTab(id);
    setTabs([...controller.getTabs()]);
    setSelectedTab(controller.getSelectedTab());
  };

  return {
    tabs,
    selectedTab,
    selectTab,
    addTab,
    closeTab,
  };
};
