import React from 'react';
import { TabItem } from '@/common/types/index.ts';
import styles from '@/pages/dashboard/styles/HeaderTabs.module.scss';

interface HeaderTabsProps {
  tabs: TabItem[];
  selectedTab?: TabItem;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  className: string;
}

/**
 * Renders a horizontal list of tabs in the header.
 *
 * Provides tab selection and close functionality for managing multiple views.
 *
 * @param props - Component props containing tab data and event handlers.
 * @returns A component that displays selectable and closable header tabs.
 *
 * @author haerim-kweon
 */
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
            data-selected={isSelected}
            data-testid={`header-tab-${tab.id}`}
            key={tab.id}
            className={`${styles.tab} ${isSelected ? styles.selectedTab : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className={styles.title}>{tab.title}</span>

            <span
              data-testid={`close-button-${tab.id}`}
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
