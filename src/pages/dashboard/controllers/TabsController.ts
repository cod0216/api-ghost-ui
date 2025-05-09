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
  constructor(
    itemList: T[],
    private idField: K,
    private titleField: L,
  ) {}

  /**
   * Selects a tab by its ID.
   *
   * @param id - The ID of the tab to select.
   */
  selectTab(id: string, tabs: TabItem[]): TabItem | undefined {
    return id ? tabs.find(tab => tab.id === id) : undefined;
  }

  /**
   * Adds a new tab for the provided item.
   * If the tab already exists, it will not be added again.
   *
   * @param item - The item to create a new tab for.
   */
  addTab(item: T, tabs: TabItem[]): TabItem[] {
    const id = String(item[this.idField]);
    const title = String(item[this.titleField]);

    if (!tabs.some(t => t.id === id)) {
      return [...tabs, { id, title }];
    }

    return tabs;
  }

  /**
   * Closes a tab by its ID.
   * If the closed tab was selected, the first available tab will be selected.
   *
   * @param id - The ID of the tab to close.
   */
  closeTab(id: string, tabs: TabItem[]): TabItem[] {
    return tabs.filter(tab => tab.id !== id);
  }
}
