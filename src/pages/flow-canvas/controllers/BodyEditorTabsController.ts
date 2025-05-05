/**
 * @fileoverview Controller for the BodyEditor popover.
 *
 * Manages the active main tab and tracks the last-selected sub tab for each main tab.
 */
type SubTab = 'header' | 'body' | 'params';
type MainTab = 'request' | 'response';

const allowedSubTabs: Record<MainTab, SubTab[]> = {
  request: ['header', 'body', 'params'],
  response: ['header', 'body'],
};

export class BodyEditorController {
  private mainTab: MainTab = 'request';
  private subTabMap: Record<MainTab, SubTab> = {
    request: 'header',
    response: 'header',
  };
  /**
   * @Returns the currently selected main tab.
   */
  getMainTab(): MainTab {
    return this.mainTab;
  }

  /**
   * @Returns the sub tab associated with the active main tab.
   */
  getSubTab(): SubTab {
    return this.subTabMap[this.mainTab];
  }

  /**
   * Switches the active main tab.
   * Does not reset sub tabs—instead preserves each tab’s last selection.
   */
  selectMainTab(tab: MainTab) {
    this.mainTab = tab;
  }

  /**
   * Updates the sub tab for the active main tab.
   * @Throws if attempting to select 'params' under the 'response' tab.
   */
  selectSubTab(tab: SubTab) {
    if (!allowedSubTabs[this.mainTab].includes(tab)) {
      throw new Error(`"${tab}" is not a valid sub-tab for "${this.mainTab}".`);
    }
    this.subTabMap[this.mainTab] = tab;
  }

  getAvailableSubTabs(): SubTab[] {
    return allowedSubTabs[this.mainTab];
  }
}
