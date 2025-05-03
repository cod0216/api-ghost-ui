/**
 * HeaderTabs component
 *
 * This component renders a tab interface for managing multiple tabs within a dashboard-like UI.
 * It allows for selecting a tab to view its content and closing tabs when no longer needed.
 * The component receives a list of tabs, the currently selected tab, and functions to handle tab selection and closing.
 *
 * @fileoverview Displays a list of tabs with close buttons, and allows tab selection and closure.
 */

import { TabItem } from '@/common/types/index.ts';
import styles from '@/pages/dashboard/styles/HeaderTabs.module.scss';

// Props interface for the HeaderTabs component
interface HeaderTabsProps {
  /**
   * List of tabs to display.
   */
  tabs: TabItem[];

  /**
   * The currently selected tab.
   * Optional, as no tab may be selected initially.
   */
  selectedTab?: TabItem;

  /**
   * Function to be called when a tab is selected.
   * @param id - The id of the selected tab.
   */
  onSelectTab: (id: string) => void;

  /**
   * Function to be called when a tab is closed.
   * @param id - The id of the tab to be closed.
   */
  onCloseTab: (id: string) => void;
}

/**
 * HeaderTabs component
 *
 * Renders a list of tabs and provides functionality to select and close tabs.
 * The selected tab is visually distinguished, and each tab includes a close button.
 */
const HeaderTabs: React.FC<HeaderTabsProps> = ({ tabs, selectedTab, onSelectTab, onCloseTab }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map(tab => {
        const isSelected = tab.id === selectedTab?.id;

        return (
          <div
            key={tab.id}
            className={`${styles.tab} ${isSelected ? styles.selectedTab : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className={styles.title}>{tab.title}</span>

            <span
              className={styles.close}
              onClick={e => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
            >
              ×
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTabs;
