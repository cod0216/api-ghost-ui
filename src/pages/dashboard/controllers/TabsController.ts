import { TabItem } from '@/common/types/index.ts';

export class TabsController<T, K extends keyof T, L extends keyof T> {
  private tabs: TabItem[] = [];
  private selectedTabId?: string;
  private itemList: T[];

  constructor(
    itemList: T[],
    private idField: K,
    private titleField: L,
  ) {
    this.itemList = itemList;
  }

  getTabs() {
    return this.tabs;
  }

  getSelectedTab() {
    return this.findTabById(this.selectedTabId);
  }

  selectTab(id: string) {
    const tab = this.findTabById(id);
    if (tab) this.selectedTabId = id;
  }

  addTab(item: T) {
    const id = String(item[this.idField]);
    const title = String(item[this.titleField]);

    if (!this.tabs.some(t => t.id === id)) {
      this.tabs.push({ id, title });
      this.selectedTabId = id;
    }
  }

  closeTab(id: string) {
    this.tabs = this.tabs.filter(tab => tab.id !== id);
    if (this.selectedTabId === id) {
      this.selectedTabId = this.tabs.length > 0 ? this.tabs[0].id : undefined;
    }
  }

  getItemForTab(tab?: { id: string; title: string }): T | null {
    return tab ? (this.itemList.find(item => item[this.idField] === tab.id) ?? null) : null;
  }

  findTabById(id?: string) {
    return id ? this.tabs.find(tab => tab.id === id) : undefined;
  }
}
