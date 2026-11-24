import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initPrivacyAnalytics } from './utils/analytics';
import './styles/index.css';

// Limpieza segura de cualquier Service Worker antiguo de versiones anteriores
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => void reg.unregister());
  }).catch(() => {});
}

initPrivacyAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
