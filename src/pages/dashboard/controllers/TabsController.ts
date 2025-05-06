export class TabsController<T extends { id: string; title: string }> {
  private tabs: { id: string; title: string }[] = [];
  private selectedTabId?: string;
  private historyList: T[];

  constructor(historyList: T[]) {
    this.historyList = historyList;
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

  addTab(tab: { id: string; title: string }) {
    if (!this.tabs.some(t => t.id === tab.id)) {
      this.tabs.push(tab);
      this.selectedTabId = tab.id;
    }
  }

  closeTab(id: string) {
    this.tabs = this.tabs.filter(tab => tab.id !== id);
    if (this.selectedTabId === id) {
      this.selectedTabId = this.tabs.length > 0 ? this.tabs[0].id : undefined;
    }
  }

  getHistoryForTab(tab?: { id: string; title: string }): T | null {
    return tab ? (this.historyList.find(h => h.id === tab.id) ?? null) : null;
  }

  private findTabById(id?: string) {
    return id ? this.tabs.find(tab => tab.id === id) : undefined;
  }
}
