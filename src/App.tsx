import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { TerritoryPage } from './pages/TerritoryPage';
import { HistoryPeoplePage } from './pages/HistoryPeoplePage';
import { AgendaPage } from './pages/AgendaPage';
import { CreditsPage } from './pages/CreditsPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/oficios" element={<CraftsmanshipPage />} />
            <Route path="/territorio" element={<TerritoryPage />} />
            <Route path="/historia" element={<HistoryPeoplePage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/creditos" element={<CreditsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </MotionConfig>
  );
}
