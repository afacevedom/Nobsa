import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { PROJECT_META } from '../../data/credits';
import { LoomRibbon } from './LoomRibbon';

export function Footer() {
  return (
    <footer className="mt-24 bg-tinta text-lana bg-loom-grid">
      <LoomRibbon height="thick" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-trigo-soft">
              Provincia del Sugamuxi · Boyacá, Colombia
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-lana">
              Nobsa
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-lana/75">
              Crónica digital de lana, piedra, vid y acero en el Alto Chicamocha. Un recorrido editorial e interactivo por sus oficios, su geografía y su memoria desde 1593.
            </p>
            <p className="mt-5 rounded-xl border border-lana/15 bg-lana/5 p-3.5 text-xs leading-relaxed text-lana/70">
              {PROJECT_META.editorialDisclaimer}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                Edición
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-lana/80">
                <li><Link to="/" className="hover:text-lana">Portada</Link></li>
                <li><Link to="/oficios" className="hover:text-lana">Oficios y Sabores</Link></li>
                <li><Link to="/territorio" className="hover:text-lana">Mapa y Territorio</Link></li>
                <li><Link to="/historia" className="hover:text-lana">Historia y Gente</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                Planear visita
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-lana/80">
                <li><Link to="/agenda" className="hover:text-lana">Calendario anual</Link></li>
                <li><Link to="/agenda#recorridos" className="hover:text-lana">Recorridos sugeridos</Link></li>
                <li><Link to="/territorio#como-llegar" className="hover:text-lana">Cómo llegar</Link></li>
                <li><Link to="/creditos" className="hover:text-lana">Fuentes y créditos</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                Referencia
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-lana/15 pt-6 text-xs text-lana/55 sm:flex-row sm:items-center">
          <p>{PROJECT_META.mapAttribution}</p>
          <p>Código bajo licencia {PROJECT_META.licenseName}.</p>
        </div>
      </div>
    </footer>
  );
}
