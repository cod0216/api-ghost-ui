/**
 * @fileoverview Controller for the BodyEditor popover.
 *
 * Manages the active main tab and tracks the last-selected sub tab for each main tab.
 */
import { CombineTab, Tab } from '@/pages/flow-canvas/types/bodyEditor';

export class BodyEditorController {
  private tabs: readonly CombineTab[];
  private mainTab: Tab;
  private subTabMap: Record<string, Tab>;

  constructor(tabs: readonly CombineTab[]) {
    this.tabs = tabs;
    this.mainTab = tabs[0].mainTab;
    this.subTabMap = tabs.reduce<Record<string, Tab>>((acc, { mainTab, subTabs }) => {
      acc[mainTab.label] = subTabs[0];
      return acc;
    }, {});
  }

  /**
   * @Returns the currently selected main tab.
   */
  getMainTab(): Tab {
    return this.mainTab;
  }

  /**
   * @Returns the sub tab associated with the active main tab.
   */
  getSubTab(): Tab {
    return this.subTabMap[this.mainTab.label];
  }

  /**
   * Switches the active main tab.
   * Does not reset sub tabs—instead preserves each tab’s last selection.
   */
  selectMainTab(tab: Tab): void {
    this.mainTab = tab;
  }

  /**
   * Updates the sub tab for the active main tab.
   * @Throws if attempting to select 'params' under the 'response' tab.
   */
  selectSubTab(tab: Tab): void {
    const group = this.tabs.find(g => g.mainTab.label === this.mainTab.label);
    const allowed = group ? group.subTabs.map(s => s.label) : [];
    if (!allowed.includes(tab.label)) {
      throw new Error(`"${tab}" is not valid for "${this.mainTab}"`);
    }
    this.subTabMap[this.mainTab.label] = tab;
  }
}
