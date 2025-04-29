import { TabItem } from '@/types/index.ts';
import styles from './HeaderTabs.module.scss';

interface HeaderTabsProps {
  tabs: TabItem[];
  selectedTab?: TabItem;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

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
                e.stopPropagation(); // prevent select on close
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
