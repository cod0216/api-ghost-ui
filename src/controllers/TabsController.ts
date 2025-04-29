/**
 * TabsController class
 *
 * Manages the state of tabs within the dashboard page, including selecting, adding, and closing tabs.
 * Tabs represent different sections of content that users can interact with.
 *
 * @fileoverview Responsible for managing the collection of tabs, tracking the selected tab,
 * and displaying the corresponding content for that tab.
 */
import { TabItem } from '@/types/index.ts';

/**
 * Controller for managing tabs within the Dashboard.
 *
 * Provides methods to select, add, and close tabs. Ensures the state of tabs is maintained
 * and the correct content is displayed for the selected tab.
 */
export class TabsController {
  private tabs: TabItem[] = []; // List of tab items in the dashboard
  private selectedTabId?: string; // ID of the currently selected tab

  /**
   * Constructor for the TabsController.
   * Initializes the tabs list and selected tab ID.
   */
  constructor() {}

  /**
   * Gets all tabs in the dashboard.
   * @returns {TabItem[]} List of all tabs.
   */
  getTabs() {
    return this.tabs;
  }

  /**
   * Gets the currently selected tab.
   * @returns {TabItem | undefined} The selected tab or undefined if no tab is selected.
   */
  getSelectedTab(): TabItem | undefined {
    return this.findTabById(this.selectedTabId, this.tabs);
  }

  /**
   * Selects a tab by its ID.
   * @param {string} id - ID of the tab to select.
   */
  selectTab(id: string) {
    const foundTab = this.findTabById(id, this.tabs);
    if (foundTab) this.selectedTabId = id;
  }

  /**
   * Adds a new tab to the dashboard.
   * @param {TabItem} tab - The tab to add.
   */
  addTab(tab: TabItem) {
    const exists = this.tabs.find(t => t.id === tab.id);
    if (!exists) this.tabs.push(tab); // Add only if it doesn't exist
    this.selectedTabId = tab.id; // Set the new tab as selected
  }

  /**
   * Closes a tab by its ID.
   * If the closed tab was selected, updates the selected tab to the first available tab.
   * @param {string} id - ID of the tab to close.
   */
  closeTab(id: string) {
    this.tabs = this.tabs.filter(tab => tab.id !== id); // Remove the tab

    if (this.selectedTabId === id) {
      this.selectedTabId = this.tabs.length > 0 ? this.tabs[0].id : undefined; // Select first tab if available
    }
  }

  /**
   * Finds a tab by its ID.
   * @param {string | undefined} id - ID of the tab to find.
   * @param {TabItem[]} tabs - The list of tabs to search.
   * @returns {TabItem | undefined} The tab with the given ID, or undefined if not found.
   */
  private findTabById(id: string | undefined, tabs: TabItem[]): TabItem | undefined {
    return id ? tabs.find(tab => tab.id === id) : undefined;
  }
}
