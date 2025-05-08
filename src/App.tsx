import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
