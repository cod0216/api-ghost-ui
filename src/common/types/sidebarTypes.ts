import { ReactNode } from 'react';

export interface SidebarSection {
  title?: string;
  titleComponent?: ReactNode;
  content: ReactNode;
  icon?: string;
}
