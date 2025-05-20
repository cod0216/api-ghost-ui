import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider } from './common/components/toast/ToastContext.tsx';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  );
};
export default App;
