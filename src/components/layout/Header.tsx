import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { LoomRibbon } from './LoomRibbon';

const NAV_ITEMS = [
  { to: '/', label: 'Portada', num: '01' },
  { to: '/oficios', label: 'Oficios y Sabores', num: '02' },
  { to: '/territorio', label: 'Mapa y Territorio', num: '03' },
  { to: '/historia', label: 'Historia y Gente', num: '04' },
  { to: '/agenda', label: 'Agenda y Rutas', num: '05' },
  { to: '/creditos', label: 'Créditos', num: '06' },
];

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex flex-col sm:flex-row sm:items-baseline sm:gap-2.5">
            <span className="font-display text-xl font-bold leading-none tracking-tight text-tinta transition group-hover:text-grana sm:text-2xl">
              NOBSA
            </span>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-tinta-muted sm:mt-0 sm:text-[11px]">
              Boyacá · Colombia
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition ${
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              title="Buscar en el sitio (Ctrl+K)"
              aria-keyshortcuts="Control+K Meta+K"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-tinta/15 bg-lana-soft px-3.5 py-2 text-xs font-medium text-tinta transition hover:border-grana hover:text-grana sm:px-4"
              aria-label="Abrir buscador del sitio"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
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

      {/* Navegación móvil editorial a pantalla completa sin alturas fijas */}
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
                  Boyacá · Colombia
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
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between border-b border-lana/10 py-4 transition ${
                      isActive ? 'text-trigo-soft' : 'text-lana hover:text-trigo-soft'
                    }`
                  }
                >
                  <span className="font-display text-2xl font-medium">{item.label}</span>
                  <span className="font-mono text-xs text-lana/50">{item.num}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-lana/15 px-6 py-6 text-xs text-lana/65">
            <p className="font-mono uppercase tracking-widest text-trigo-soft">
              Alto Chicamocha · Provincia del Sugamuxi
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
