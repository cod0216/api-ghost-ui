import { createBrowserRouter, Navigate } from 'react-router-dom';
import FlowCanvasMain from './pages/flow-canvas/FlowCanvasMain';
import Dashboard from './pages/dashboard/Dashboard';
import { ROUTES } from '@/config/routes';
import AppLayout from './AppLayout';
import NotFound from '@/pages/notfound/NotFound';
import LoadTest from '@/pages/loadtest/LoadTest';

const router = createBrowserRouter([
  {
    path: '/apighost-ui/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '', element: <Navigate to={ROUTES.FLOW_CANVAS.path} replace /> },
      { path: ROUTES.FLOW_CANVAS.path, element: <FlowCanvasMain /> },
      { path: ROUTES.DASHBOARD.path, element: <Dashboard /> },
      { path: ROUTES.LOADTEST.path, element: <LoadTest /> },
    ],
  },
]);

export default router;
