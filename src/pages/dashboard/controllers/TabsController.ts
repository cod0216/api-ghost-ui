import { TabItem } from '@/common/types/index.ts';

/**
 * A controller for managing tabs in a tabbed interface.
 * It manages the creation, selection, and closing of tabs,
 * as well as retrieving data associated with the tabs.
 *
 * @template T - The type of items that populate the tabs.
 * @template K - The key of the unique identifier field in the item type.
 * @template L - The key of the title field in the item type.
 *
 * @author haerim-kweon
 */
export class TabsController<T, K extends keyof T, L extends keyof T> {
  private tabs: TabItem[] = [];
  private selectedTabId?: string;
  private itemList: T[];

  /**
   * Creates an instance of the TabsController.
   *
   * @param itemList - The list of items to create tabs for.
   * @param idField - The field to use as the tab's unique identifier.
   * @param titleField - The field to use as the tab's title.
   */
  constructor(
    itemList: T[],
    private idField: K,
    private titleField: L,
  ) {
    this.itemList = itemList;
  }

  /**
   * Retrieves the list of all current tabs.
   *
   * @returns The list of tabs.
   */
  getTabs() {
    return this.tabs;
  }

  /**
   * Retrieves the currently selected tab.
   *
   * @returns The selected tab, or undefined if no tab is selected.
   */
  getSelectedTab() {
    return this.findTabById(this.selectedTabId);
  }

  /**
   * Selects a tab by its ID.
   *
   * @param id - The ID of the tab to select.
   */
  selectTab(id: string) {
    const tab = this.findTabById(id);
    if (tab) this.selectedTabId = id;
  }

  /**
   * Adds a new tab for the provided item.
   * If the tab already exists, it will not be added again.
   *
   * @param item - The item to create a new tab for.
   */
  addTab(item: T) {
    const id = String(item[this.idField]);
    const title = String(item[this.titleField]);

    if (!this.tabs.some(t => t.id === id)) {
      this.tabs.push({ id, title });
      this.selectedTabId = id;
    }
  }

  /**
   * Closes a tab by its ID.
   * If the closed tab was selected, the first available tab will be selected.
   *
   * @param id - The ID of the tab to close.
   */
  closeTab(id: string) {
    this.tabs = this.tabs.filter(tab => tab.id !== id);
    if (this.selectedTabId === id) {
      this.selectedTabId = this.tabs.length > 0 ? this.tabs[0].id : undefined;
    }
  }

  /**
   * Retrieves the item associated with a specific tab.
   *
   * @param tab - The tab to retrieve the associated item for.
   * @returns The item associated with the tab, or null if no item is found.
   */
  getItemForTab(tab?: { id: string; title: string }): T | null {
    return tab ? (this.itemList.find(item => item[this.idField] === tab.id) ?? null) : null;
  }

  /**
   * Finds a tab by its ID.
   *
   * @param id - The ID of the tab to find.
   * @returns The tab with the matching ID, or undefined if not found.
   */
  findTabById(id?: string) {
    return id ? this.tabs.find(tab => tab.id === id) : undefined;
  }
}
