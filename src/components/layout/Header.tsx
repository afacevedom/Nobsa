import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bookmark, Menu, Search, X } from 'lucide-react';
import { LoomRibbon } from './LoomRibbon';
import { useLanguage } from '../../context/LanguageContext';
import { useVisitPlanner } from '../../context/VisitPlannerContext';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const { totalSaved } = useVisitPlanner();

  const navItems = [
    { to: '/', label: t.nav.home, full: t.navFull.home, num: '01' },
    { to: '/oficios', label: t.nav.crafts, full: t.navFull.crafts, num: '02' },
    { to: '/territorio', label: t.nav.territory, full: t.navFull.territory, num: '03' },
    { to: '/historia', label: t.nav.history, full: t.navFull.history, num: '04' },
    { to: '/agenda', label: t.nav.agenda, full: t.navFull.agenda, num: '05' },
    { to: '/creditos', label: t.nav.credits, full: t.navFull.credits, num: '06' },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-tinta/10 bg-lana/95 backdrop-blur-md">
        <LoomRibbon height="thin" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex shrink-0 flex-col sm:flex-row sm:items-baseline sm:gap-2.5">
            <span className="font-display text-xl font-bold leading-none tracking-tight text-tinta transition group-hover:text-grana sm:text-2xl">
              NOBSA
            </span>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-tinta-muted sm:mt-0 sm:text-[11px]">
              {t.brandSub}
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-tinta text-lana'
                      : 'text-tinta-muted hover:bg-lana-deep hover:text-tinta'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Selector bilingüe seguro ES / EN */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="inline-flex min-h-[38px] items-center rounded-full border border-tinta/15 bg-lana-soft px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase text-tinta transition hover:border-grana hover:text-grana"
            >
              <span className={lang === 'es' ? 'text-grana' : 'text-tinta-soft'}>ES</span>
              <span className="mx-1 text-tinta/30">/</span>
              <span className={lang === 'en' ? 'text-grana' : 'text-tinta-soft'}>EN</span>
            </button>

            {/* Acceso directo a Mi Visita con contador */}
            <NavLink
              to="/mi-visita"
              className={({ isActive }) =>
                `inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'border-grana bg-grana text-lana'
                    : 'border-tinta/15 bg-lana-soft text-tinta hover:border-grana hover:text-grana'
                }`
              }
              aria-label={t.navFull.planner}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.nav.planner}</span>
              {totalSaved > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-tinta px-1.5 font-mono text-[10px] font-semibold text-lana">
                  {totalSaved}
                </span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={onOpenSearch}
              title="Buscar en el sitio (Ctrl+K)"
              aria-keyshortcuts="Control+K Meta+K"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-tinta/15 bg-lana-soft px-3 py-1.5 text-xs font-medium text-tinta transition hover:border-grana hover:text-grana sm:px-3.5"
              aria-label={t.searchBtn}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t.searchBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-tinta/15 bg-lana-soft text-tinta transition hover:border-grana lg:hidden"
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileOpen}
              aria-controls="menu-movil-editorial"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      {mobileOpen && (
        <div
          id="menu-movil-editorial"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-tinta text-lana lg:hidden bg-loom-grid"
        >
          <div>
            <LoomRibbon height="thin" />
            <div className="flex items-center justify-between border-b border-lana/10 px-5 py-4">
              <div>
                <p className="font-display text-xl font-bold leading-none text-lana">NOBSA</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-trigo-soft">
                  {t.brandSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lana/20 bg-lana/10 text-lana"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Menú móvil" className="px-6 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between border-b border-lana/10 py-3.5 transition ${
                      isActive ? 'text-trigo-soft' : 'text-lana hover:text-trigo-soft'
                    }`
                  }
                >
                  <span className="font-display text-2xl font-medium">{item.full}</span>
                  <span className="font-mono text-xs text-lana/50">{item.num}</span>
                </NavLink>
              ))}
              <NavLink
                to="/mi-visita"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-baseline justify-between border-b border-lana/10 py-3.5 transition ${
                    isActive ? 'text-trigo-soft' : 'text-lana hover:text-trigo-soft'
                  }`
                }
              >
                <span className="font-display text-2xl font-medium">{t.navFull.planner}</span>
                <span className="font-mono text-xs text-trigo-soft">{totalSaved}</span>
              </NavLink>
            </nav>
          </div>

          <div className="border-t border-lana/15 px-6 py-6 text-xs text-lana/65">
            <p className="font-mono uppercase tracking-widest text-trigo-soft">
              {t.heroBadge}
            </p>
            <p className="mt-1">
              Edición cultural independiente sobre Nobsa, Boyacá, Colombia.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
