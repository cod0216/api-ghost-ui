import flowIcon from '@/assets/icons/flow.svg';
import dashboardIcon from '@/assets/icons/dashboard.svg';

export const ROUTES = {
  FLOW_CANVAS: {
    path: 'flow-canvas',
    icon: flowIcon,
    label: 'canvas',
  },
  DASHBOARD: {
    path: 'dashboard',
    icon: dashboardIcon,
    label: 'dashboard',
  },
} as const;
