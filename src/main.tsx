import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { loadConfig } from '@/config/urlConfig';
import { setBaseUrl } from '@/common/service/api';

loadConfig().then(config => {
  setBaseUrl(config.baseUrl);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
