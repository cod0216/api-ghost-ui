/**
 * BodyEditorController class
 *
 * Manages the state of the BodyEditor popover, including main and sub tab selection.
 */
export class BodyEditorController {
  private mainTab: 'request' | 'response' = 'request';
  private subTab: 'header' | 'body' | 'params' = 'body';

  /**
   * Gets current main tab.
   */
  getMainTab(): 'request' | 'response' {
    return this.mainTab;
  }

  /**
   * Gets current sub tab.
   */
  getSubTab(): 'header' | 'body' | 'params' {
    return this.subTab;
  }

  /**
   * Selects a main tab and resets sub tab to default for that context.
   */
  selectMainTab(tab: 'request' | 'response') {
    this.mainTab = tab;
    // default sub-tab per main selection
    this.subTab = tab === 'request' ? 'body' : 'header';
  }

  /**
   * Selects a sub tab. UI should ensure only valid combos are passed.
   */
  selectSubTab(tab: 'header' | 'body' | 'params') {
    this.subTab = tab;
  }
}
