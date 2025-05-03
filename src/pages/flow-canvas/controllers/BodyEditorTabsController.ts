/**
 * @fileoverview Controller for the BodyEditor popover.
 *
 * Manages the active main tab and tracks the last-selected sub tab for each main tab.
 */
export class BodyEditorController {
  private mainTab: 'request' | 'response' = 'request';

  private subTabMap: {
    request: 'header' | 'body' | 'params';
    response: 'header' | 'body';
  } = {
    request: 'header',
    response: 'header',
  };

  /**
   * @Returns the currently selected main tab.
   */
  getMainTab(): 'request' | 'response' {
    return this.mainTab;
  }

  /**
   * @Returns the sub tab associated with the active main tab.
   */
  getSubTab(): 'header' | 'body' | 'params' {
    return this.subTabMap[this.mainTab];
  }

  /**
   * Switches the active main tab.
   * Does not reset sub tabs—instead preserves each tab’s last selection.
   */
  selectMainTab(tab: 'request' | 'response') {
    this.mainTab = tab;
  }

  /**
   * Updates the sub tab for the active main tab.
   * @Throws if attempting to select 'params' under the 'response' tab.
   */
  selectSubTab(tab: 'header' | 'body' | 'params') {
    if (this.mainTab === 'request') {
      this.subTabMap.request = tab;
    } else {
      if (tab === 'params') {
        throw new Error('Cannot select "params" under the response tab.');
      }
      this.subTabMap.response = tab;
    }
  }
}
