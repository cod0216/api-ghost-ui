import { TabItem } from '@/types/index.ts';

export class TabsController {
  private tabs: TabItem[] = [];
  private selectedTabId?: string;

  constructor() {}

  getTabs() {
    return this.tabs;
  }

  getSelectedTab(): TabItem | undefined {
    return this.findTabById(this.selectedTabId, this.tabs);
  }

  selectTab(id: string) {
    const foundTab = this.findTabById(id, this.tabs);
    if (foundTab) this.selectedTabId = id;
  }

  addTab(tab: TabItem) {
    const exists = this.tabs.find(t => t.id === tab.id);
    if (!exists) this.tabs.push(tab);
    this.selectedTabId = tab.id;
  }

  closeTab(id: string) {
    this.tabs = this.tabs.filter(tab => tab.id !== id);

    if (this.selectedTabId === id) {
      this.selectedTabId = this.tabs.length > 0 ? this.tabs[0].id : undefined;
    }
  }

  private findTabById(id: string | undefined, tabs: TabItem[]): TabItem | undefined {
    return id ? tabs.find(tab => tab.id === id) : undefined;
  }
}
