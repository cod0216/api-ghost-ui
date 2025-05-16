import React, { ReactNode, useState } from 'react';
import styles from './CommonSidebar.module.scss';
import { SidebarSection } from '@/common/types/index.ts';

interface CommonSidebarProps {
  className?: string;
  header?: ReactNode;
  headerIcon?: string;
  search?: boolean;
  sections?: SidebarSection[];
}

/**
 * A sidebar component for displaying a list of sections, with an optional search input and custom header.
 *
 * @param {CommonSidebarProps} props - The properties for configuring the sidebar.
 * @returns JSX.Element - The rendered sidebar component.
 *
 * @author haerim-kweon
 */
const CommonSidebar: React.FC<CommonSidebarProps> = ({
  className = '',
  header = <h2>Ghost API</h2>,
  headerIcon = null,
  search = false,
  sections = [],
}) => {
  const [isExpand, setexpand] = useState(false);

  const toggleExpand = () => {
    setexpand(expand => !expand);
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${isExpand ? styles.expand : ''} ${className}`.trim()}
    >
      <div className={styles.wrappHeader}>
        {!isExpand && <div className={`${styles.title}`}>{header}</div>}
        <button
          className={styles.iconButton}
          aria-label={isExpand ? 'expand sidebar' : 'Collapse sidebar'}
          onClick={toggleExpand}
        >
          {headerIcon ? <img src={headerIcon} className={styles.icon} alt="toggle icon" /> : ''}
        </button>
      </div>
      {!isExpand && search && <input type="text" placeholder="Search" className={styles.search} />}
      {!isExpand &&
        sections.map(({ title, content }, index) => (
          <div key={index} className={styles.section}>
            {title && <h4>{title}</h4>}
            {content}
          </div>
        ))}
    </div>
  );
};

export default CommonSidebar;
