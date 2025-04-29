/**
 * useTabsController hook
 *
 * Custom hook that manages the state of tabs in the dashboard, interacting with the TabsController.
 * Provides functionality to select, add, and close tabs while maintaining the list of tabs and the selected tab.
 */
import { useState } from 'react';
import { TabsController } from '@/controllers/TabsController.ts';
import { TabItem } from '@/types/index.ts';

/**
 * Hook to manage tab state and actions in the dashboard.
 *
 * Uses the TabsController to handle business logic for tab management and provides state and functions
 * to interact with the tabs in the UI.
 *
 * @returns {object} Contains:
 * - `tabs`: List of available tabs.
 * - `selectedTab`: Currently selected tab, or undefined if none.
 * - `selectTab`: Function to select a tab by ID.
 * - `addTab`: Function to add a new tab.
 * - `closeTab`: Function to close a tab by ID.
 */
export const useTabsController = () => {
  const [controller] = useState(() => new TabsController()); // Instance of TabsController
  const [tabs, setTabs] = useState<TabItem[]>([]); // List of tabs
  const [selectedTab, setSelectedTab] = useState<TabItem | undefined>(undefined); // Selected tab

  /**
   * Select a tab by ID.
   * @param {string} id - ID of the tab to select.
   */
  const selectTab = (id: string) => {
    controller.selectTab(id);
    setSelectedTab(controller.getSelectedTab());
  };

  /**
   * Add a new tab to the list.
   * @param {TabItem} tab - The tab to add.
   */
  const addTab = (tab: TabItem) => {
    controller.addTab(tab);
    setTabs([...controller.getTabs()]);
    setSelectedTab(controller.getSelectedTab());
  };

  /**
   * Close a tab by ID.
   * @param {string} id - ID of the tab to close.
   */
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
