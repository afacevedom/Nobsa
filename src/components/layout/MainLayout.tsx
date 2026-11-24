import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchCommand } from '../interactive/SearchCommand';
import { LightboxModal } from '../interactive/LightboxModal';
import { useLanguage } from '../../context/LanguageContext';

export function MainLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-lana text-tinta">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-sm focus:text-lana"
      >
        {t.skipToContent}
      </a>

      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main id="contenido-principal" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LightboxModal />
    </div>
  );
}
