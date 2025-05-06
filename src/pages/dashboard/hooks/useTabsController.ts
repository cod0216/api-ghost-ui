import { useState } from 'react';
import { TabsController } from '@/pages/dashboard/controllers/TabsController.ts';
import { TabItem } from '@/common/types/index.ts';

interface UseTabsControllerProps<T, K extends keyof T, L extends keyof T> {
  itemList: T[];
  idField: K;
  titleField: L;
  onItemSelected?: (item: T) => void;
}

export const useTabsController = <T, K extends keyof T, L extends keyof T>(
  props: UseTabsControllerProps<T, K, L>,
) => {
  const { itemList, idField, titleField, onItemSelected } = props;
  const [controller] = useState(() => new TabsController<T, K, L>(itemList, idField, titleField));

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined);

  const updateTabsAndSelection = () => {
    const updatedTabs = controller.getTabs();
    const currentTab = controller.getSelectedTab();

    setTabs([...updatedTabs]);
    setSelectedTab(currentTab);
  };

  const selectTab = (id: string) => {
    controller.selectTab(id);
    updateTabsAndSelection();
  };

  const addTab = (item: T) => {
    controller.addTab(item);
    updateTabsAndSelection();
  };

  const closeTab = (id: string) => {
    controller.closeTab(id);
    updateTabsAndSelection();
  };

  const handleSelectItem = (item: T) => {
    const exists = tabs.find(tab => tab.id === item[idField]);
    if (exists) {
      selectTab(item[idField] as string);
    } else {
      addTab(item);
    }

    if (onItemSelected) {
      onItemSelected(item);
    }
  };

  return {
    tabs,
    selectedTab,
    selectTab,
    addTab,
    closeTab,
    handleSelectItem,
  };
};
