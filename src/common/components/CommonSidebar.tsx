import { ReactNode } from 'react';
import styles from './CommonSidebar.module.scss';

interface SidebarSection {
  title?: string;
  content: ReactNode;
}

interface SidebarProps {
  className?: string;
  header?: ReactNode;
  search?: boolean;
  sections?: SidebarSection[];
}

const CommonSidebar: React.FC<SidebarProps> = ({
  className = '',
  header = <h2>Ghost API</h2>,
  search = true,
  sections = [],
}) => {
  return (
    <div className={`${styles.sidebarContainer} ${className}`}>
      {header}
      {search && <input type="text" placeholder="Search" className={styles.search} />}
      {sections.map(({ title, content }, index) => (
        <div key={index} className={styles.section}>
          {title && <h4>{title}</h4>}
          {content}
        </div>
      ))}
    </div>
  );
};

export default CommonSidebar;
