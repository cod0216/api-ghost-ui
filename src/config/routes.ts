import flowIcon from '@/assets/icons/flow.svg';
import dashboardIcon from '@/assets/icons/dashboard.svg';
import loadtest from '@/assets/icons/loadtest.svg';

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
  LOADTEST: {
    path: 'loadtest',
    icon: loadtest,
    label: 'loadtest',
  },
} as const;
