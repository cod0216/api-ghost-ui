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

interface HeaderTabsProps {
  tabs: TabItem[];
  selectedTab?: TabItem;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  className: string;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({
  tabs,
  selectedTab,
  onSelectTab,
  onCloseTab,
  className,
}) => {
  return (
    <div className={`${styles.tabs} ${className}`}>
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
