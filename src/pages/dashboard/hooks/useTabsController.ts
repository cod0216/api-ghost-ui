import { useState, useMemo, useEffect } from 'react';
import { TabsController } from '@/pages/dashboard/controllers/TabsController.ts';
import { TabItem } from '@/common/types/index.ts';

/**
 * Custom hook that provides state management and logic for handling tabs in a tabbed interface.
 * It interacts with the `TabsController` to manage tab operations and expose relevant state.
 *
 * @template T - The type of items that populate the tabs.
 * @template K - The key of the unique identifier field in the item type.
 * @template L - The key of the title field in the item type.
 *
 * @author haerim-kweon
 */
interface UseTabsControllerProps<T, K extends keyof T, L extends keyof T> {
  itemList: T[];
  idField: K;
  titleField: L;
  onItemSelected?: (item: any) => void;
}

/**
 * Custom hook to manage tabs in a tabbed interface.
 * Provides functions to select, add, close tabs, and track the selected tab.
 * Also triggers a callback when an item is selected, allowing external handling of item selection.
 *
 * @param props - The properties used to configure the hook.
 * @returns An object with the current state and functions for managing tabs.
 *
 * @author haerim-kweon
 */
export const useTabsController = <T, K extends keyof T, L extends keyof T>(
  props: UseTabsControllerProps<T, K, L>,
) => {
  const { itemList, idField, titleField, onItemSelected } = props;
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined);

  const controller = useMemo(() => {
    return new TabsController<T, K, L>(itemList, idField, titleField);
  }, [itemList]);

  /**
   * Updates the state of tabs and selected tab.
   * This function is called after any tab modification.
   */
  const updateTabsAndSelection = (updatedTab: TabItem | undefined, updatedTabs: TabItem[]) => {
    const fallbackTab = updatedTab ?? updatedTabs[0];
    setTabs([...updatedTabs]);
    setSelectedTab(fallbackTab);
  };

  /**
   * Selects a tab by its ID and updates the tab state.
   *
   * @param id - The ID of the tab to select.
   */
  const selectTab = (id: string) => {
    const updatedTab: TabItem | undefined = controller.selectTab(id, tabs);
    setSelectedTab(updatedTab);
  };

  /**
   * Adds a new tab for the provided item and updates the tab state.
   *
   * @param item - The item to create a new tab for.
   */
  const addTab = (item: T) => {
    const updatedTabs: TabItem[] = controller.addTab(item, tabs);
    const updatedTab: TabItem | undefined = controller.selectTab(
      item[idField] as string,
      updatedTabs,
    );

    updateTabsAndSelection(updatedTab, updatedTabs);
  };

  /**
   * Closes a tab by its ID and updates the tab state.
   *
   * @param id - The ID of the tab to close.
   */
  const closeTab = (id: string) => {
    const updatedTabs: TabItem[] = controller.closeTab(id, tabs);
    const newSelected = selectedTab?.id === id ? updatedTabs[0] : selectedTab;
    updateTabsAndSelection(newSelected, updatedTabs);
  };

  /**
   * Handles the selection of an item and triggers adding or selecting a tab.
   * Also calls the `onItemSelected` callback if provided.
   *
   * @param item - The item that was selected.
   */
  const handleSelectItem = (item: T) => {
    const exists = tabs.find(tab => tab.id === item[idField]);

    if (exists) {
      selectTab(item[idField] as string);
    } else {
      addTab(item);
    }
  };

  useEffect(() => {
    if (onItemSelected) {
      selectedTab ? onItemSelected(selectedTab.id) : onItemSelected(null);
    }
  }, [selectedTab]);

  return {
    tabs,
    selectedTab,
    selectTab,
    addTab,
    closeTab,
    handleSelectItem,
  };
};
