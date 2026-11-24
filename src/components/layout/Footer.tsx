import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { PROJECT_META } from '../../data/credits';
import { LoomRibbon } from './LoomRibbon';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 bg-tinta text-lana bg-loom-grid sm:mt-24">
      <LoomRibbon height="thick" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-trigo-soft">
              {t.heroBadge}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-lana">
              Nobsa
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-lana/75">
              {t.footerTagline}
            </p>
            <p className="mt-5 rounded-xl border border-lana/15 bg-lana/5 p-3.5 text-xs leading-relaxed text-lana/70">
              {PROJECT_META.editorialDisclaimer}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                {t.footerEdition}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-lana/80">
                <li><Link to="/" className="hover:text-lana">{t.navFull.home}</Link></li>
                <li><Link to="/oficios" className="hover:text-lana">{t.navFull.crafts}</Link></li>
                <li><Link to="/territorio" className="hover:text-lana">{t.navFull.territory}</Link></li>
                <li><Link to="/historia" className="hover:text-lana">{t.navFull.history}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                {t.footerPlan}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-lana/80">
                <li><Link to="/mi-visita" className="hover:text-lana">{t.navFull.planner}</Link></li>
                <li><Link to="/agenda" className="hover:text-lana">{t.navFull.agenda}</Link></li>
                <li><Link to="/territorio#como-llegar" className="hover:text-lana">Cómo llegar</Link></li>
                <li><Link to="/creditos" className="hover:text-lana">{t.navFull.credits}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                {t.footerRef}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-lana/80">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-trigo-soft" />
                  <span>195 km al norte de Bogotá · 71 km de Tunja</span>
                </p>
                <a
                  href={`mailto:${PROJECT_META.contactEmail}`}
                  className="inline-flex items-center gap-2 text-lana hover:text-trigo-soft"
                >
                  <Mail className="h-4 w-4 shrink-0 text-trigo-soft" />
                  <span className="break-all">{PROJECT_META.contactEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-lana/15 pt-6 text-xs text-lana/55 sm:flex-row sm:items-center">
          <p>{PROJECT_META.mapAttribution}</p>
          <p>Código bajo licencia {PROJECT_META.licenseName}.</p>
        </div>
      </div>
    </footer>
  );
}
