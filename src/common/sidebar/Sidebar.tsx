/**
 * @fileoverview Sidebar component for the dashboard page.
 * Provides navigation and request history features.
 */

import styles from './Sidebar.module.scss';
import { HistoryItem } from '@/common/types/index.ts';

interface SidebarProps {
  historyList: HistoryItem[];
  onClickItem: (item: HistoryItem) => void;
  className: string;
}

/**
 * Sidebar component displays the application title,
 * search input, and a history section for previous requests.
 *
 * @returns A React component representing the sidebar UI.
 */
const Sidebar: React.FC<SidebarProps> = ({ historyList, onClickItem, className }) => {
  return (
    <div className={`${styles.sidebarContainer} ${className}`}>
      <h2>Ghost API</h2>
      <input type="text" placeholder="Search" className={styles.search} />
      <h4>History</h4>
      <div className={styles.historyContainer}>
        {historyList.map(item => (
          <div className={styles.historyItem} key={item.id} onClick={() => onClickItem(item)}>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
