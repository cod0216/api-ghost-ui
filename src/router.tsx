import { createBrowserRouter, Navigate } from 'react-router-dom';
import FlowCanvasMain from './pages/flow-canvas/FlowCanvasMain.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import { ROUTES } from '@/config/routes.ts';
import AppLayout from './AppLayout.tsx';

const router = createBrowserRouter([
  {
    path: '/apighost-ui/',
    element: <AppLayout />,
    children: [
      { path: '', element: <Navigate to={ROUTES.FLOW_CANVAS.path} /> },
      { path: ROUTES.FLOW_CANVAS.path, element: <FlowCanvasMain /> },
      { path: ROUTES.DASHBOARD.path, element: <Dashboard /> },
    ],
  },
]);

export default router;
