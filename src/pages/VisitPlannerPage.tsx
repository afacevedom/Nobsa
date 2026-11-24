import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Check,
  Download,
  MapPin,
  Printer,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { PLACES } from '../data/places';
import { FESTIVALS, SUGGESTED_JOURNEYS } from '../data/festivals';
import { useVisitPlanner } from '../context/VisitPlannerContext';
import { useLanguage } from '../context/LanguageContext';
import { FESTIVAL_EN, PLACE_EN } from '../i18n/translations';
import { downloadGpxFile, totalRouteDistanceKm } from '../utils/gpx';
import { NavigationActions } from '../components/interactive/NavigationActions';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SeoHead } from '../components/seo/SeoHead';

export function VisitPlannerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const { lang, t } = useLanguage();
  const {
    placeIds,
    festivalIds,
    notes,
    togglePlace,
    toggleFestival,
    movePlace,
    loadTemplate,
    setNotes,
    clearAll,
  } = useVisitPlanner();

  useEffect(() => {
    const lugaresParam = searchParams.get('lugares');
    const eventosParam = searchParams.get('eventos');
    if (lugaresParam || eventosParam) {
      const nextPlaces = lugaresParam ? lugaresParam.split(',').filter(Boolean) : [];
      const nextEvents = eventosParam ? eventosParam.split(',').filter(Boolean) : [];
      loadTemplate(nextPlaces, nextEvents);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, loadTemplate, setSearchParams]);

  const savedPlaces = useMemo(
    () =>
      placeIds
        .map((id) => PLACES.find((p) => p.id === id))
        .filter((p): p is (typeof PLACES)[number] => Boolean(p)),
    [placeIds]
  );

  const savedFestivals = useMemo(
    () =>
      festivalIds
        .map((id) => FESTIVALS.find((f) => f.id === id))
        .filter((f): f is (typeof FESTIVALS)[number] => Boolean(f)),
    [festivalIds]
  );

  const approxKm = useMemo(() => totalRouteDistanceKm(savedPlaces), [savedPlaces]);
  const gpsStopsCount = savedPlaces.filter((p) => p.lat !== null && p.lon !== null).length;

  const handleCopyShareLink = async () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (placeIds.length > 0) params.set('lugares', placeIds.join(','));
    if (festivalIds.length > 0) params.set('eventos', festivalIds.join(','));
    const shareUrl = `${base}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2600);
    } catch {
      window.prompt('Copia este enlace de tu itinerario:', shareUrl);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SeoHead
        title="Mi Visita a Nobsa — Planificador de Itinerario y Rutas | Nobsa, Boyacá"
        description="Organiza tu recorrido personal por Nobsa, Boyacá: guarda lugares y festividades, abre indicaciones en Google Maps o Waze, comparte tu itinerario por enlace, imprime en PDF o descarga el archivo GPX."
        path="/mi-visita"
        keywords="planear viaje a Nobsa, itinerario Nobsa Boyacá, ruta turística Nobsa, descargar GPX Nobsa"
      />

      <div className="flex flex-col justify-between gap-6 border-b border-tinta/10 pb-8 lg:flex-row lg:items-end">
        <SectionHeader
          as="h1"
          index="07"
          eyebrow={lang === 'en' ? 'Personal itinerary builder' : 'Armador personal de recorrido'}
          title={t.navFull.planner}
          lead={
            lang === 'en'
              ? 'Save your favorite stops and dates in your browser, open turn-by-turn navigation in Google Maps or Waze, print a clean PDF, or export a .GPX track.'
              : 'Guarda tus paradas y festividades favoritas en tu navegador, abre la ruta directa en Google Maps o Waze, imprime en PDF o comparte tu recorrido por enlace.'
          }
        />

        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            disabled={gpsStopsCount === 0}
            onClick={() => downloadGpxFile('mi-visita-nobsa.gpx', 'Mi Visita a Nobsa', savedPlaces)}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-musgo px-4 py-2 text-xs font-semibold text-lana transition hover:bg-musgo-dark disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Download className="h-3.5 w-3.5" />
            {t.downloadGpx}
          </button>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-tinta px-4 py-2 text-xs font-semibold text-lana transition hover:bg-grana"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-trigo-soft" /> : <Share2 className="h-3.5 w-3.5" />}
            {copiedLink ? (lang === 'en' ? 'Link copied' : 'Enlace copiado') : (lang === 'en' ? 'Share link' : 'Compartir enlace')}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-tinta/20 bg-lana-soft px-4 py-2 text-xs font-medium text-tinta transition hover:border-tinta"
          >
            <Printer className="h-3.5 w-3.5" />
            {lang === 'en' ? 'Print / PDF' : 'Imprimir / PDF'}
          </button>
        </div>
      </div>

      {/* Plantillas rápidas de 1 clic */}
      <section className="no-print mt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-grana">
          {lang === 'en' ? 'Load a suggested itinerary in 1 click' : 'Cargar una ruta sugerida en 1 clic'}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {SUGGESTED_JOURNEYS.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => loadTemplate(j.stops.map((s) => s.placeId))}
              className="rounded-2xl border border-tinta/10 bg-lana-soft p-4 text-left transition hover:border-grana"
            >
              <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-grana">
                <Sparkles className="h-3 w-3" /> {j.duration}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-tinta">{j.title}</p>
              <p className="mt-1 text-xs text-tinta-muted">{j.stops.length} paradas</p>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold text-tinta">
              {lang === 'en' ? 'Saved stops' : 'Paradas de mi recorrido'} ({savedPlaces.length})
            </h2>
            {gpsStopsCount >= 2 && (
              <span className="font-mono text-xs text-musgo">
                ~{approxKm.toFixed(1)} km en línea recta ({gpsStopsCount} puntos GPS)
              </span>
            )}
          </div>

          {savedPlaces.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-tinta/20 bg-lana-soft p-8 text-center">
              <Bookmark className="mx-auto h-7 w-7 text-tinta-soft" />
              <p className="mt-3 text-sm text-tinta-muted">
                {lang === 'en'
                  ? 'No stops saved yet. Add places from the interactive map or load a template above.'
                  : 'Aún no has guardado paradas. Agrega lugares desde el mapa interactivo o carga una ruta sugerida arriba.'}
              </p>
              <Link
                to="/territorio"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-xs font-medium text-lana hover:bg-grana"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t.heroCtaMap}
              </Link>
            </div>
          ) : (
            <ol className="space-y-3">
              {savedPlaces.map((place, idx) => {
                const title = lang === 'en' && PLACE_EN[place.id] ? PLACE_EN[place.id].name : place.name;
                const summary =
                  lang === 'en' && PLACE_EN[place.id] ? PLACE_EN[place.id].summary : place.summary;
                return (
                  <li
                    key={place.id}
                    className="rounded-2xl border border-tinta/10 bg-lana-soft p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tinta font-mono text-xs font-semibold text-lana">
                          {idx + 1}
                        </span>
                        <div>
                          <Link
                            to={`/territorio?lugar=${place.id}`}
                            className="font-display text-lg font-semibold text-tinta hover:text-grana"
                          >
                            {title}
                          </Link>
                          <p className="mt-1 text-xs leading-relaxed text-tinta-muted">{summary}</p>
                        </div>
                      </div>

                      <div className="no-print flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePlace(place.id, 'up')}
                          aria-label="Subir parada"
                          className="rounded-lg p-1.5 text-tinta-muted hover:bg-lana-deep disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === savedPlaces.length - 1}
                          onClick={() => movePlace(place.id, 'down')}
                          aria-label="Bajar parada"
                          className="rounded-lg p-1.5 text-tinta-muted hover:bg-lana-deep disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePlace(place.id)}
                          aria-label="Quitar parada"
                          className="rounded-lg p-1.5 text-tinta-muted hover:bg-grana/10 hover:text-grana"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {place.lat !== null && place.lon !== null && (
                      <div className="no-print mt-3.5 border-t border-tinta/10 pt-3 pl-10">
                        <NavigationActions lat={place.lat} lon={place.lon} compact />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="no-print rounded-2xl border border-tinta/10 bg-lana-deep/50 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-tinta-muted">
              {lang === 'en' ? 'Add or remove verified places' : 'Agregar o quitar lugares de Nobsa'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PLACES.map((p) => {
                const selected = placeIds.includes(p.id);
                const label = lang === 'en' && PLACE_EN[p.id] ? PLACE_EN[p.id].name : p.name;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlace(p.id)}
                    aria-pressed={selected}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      selected
                        ? 'bg-tinta text-lana'
                        : 'border border-tinta/15 bg-lana-soft text-tinta hover:border-grana'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-tinta/10 bg-lana-soft p-6">
            <h2 className="font-display text-xl font-semibold text-tinta">
              {lang === 'en' ? 'Saved events' : 'Festividades guardadas'} ({savedFestivals.length})
            </h2>
            {savedFestivals.length === 0 ? (
              <p className="mt-3 text-xs text-tinta-muted">
                {lang === 'en'
                  ? 'Bookmark dates from the Events page to keep them in your plan.'
                  : 'Marca fechas en la página de Agenda para tenerlas a mano.'}
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-tinta/10">
                {savedFestivals.map((f) => {
                  const title = lang === 'en' && FESTIVAL_EN[f.id] ? FESTIVAL_EN[f.id].title : f.title;
                  const month =
                    lang === 'en' && FESTIVAL_EN[f.id] ? FESTIVAL_EN[f.id].monthLabel : f.monthLabel;
                  return (
                    <li key={f.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-grana">
                          {month}
                        </span>
                        <p className="text-sm font-medium text-tinta">{title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFestival(f.id)}
                        aria-label="Quitar festividad"
                        className="no-print rounded-lg p-1.5 text-tinta-muted hover:text-grana"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-tinta/10 bg-lana-soft p-6">
            <label htmlFor="visit-notes" className="block font-display text-xl font-semibold text-tinta">
              {lang === 'en' ? 'Personal notes' : 'Notas personales de viaje'}
            </label>
            <p className="mt-1 text-xs text-tinta-muted">
              {lang === 'en'
                ? 'Stored only in your browser. Printed automatically if you export to PDF.'
                : 'Se guardan solo en tu navegador y se incluyen si imprimes tu plan en PDF.'}
            </p>
            <textarea
              id="visit-notes"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'E.g., Leave early for Cruz de Aranda hike, stop at Puntalarga in the afternoon…'
                  : 'Ej.: Salir temprano a la caminata de Cruz de Aranda, comprar ruana en el centro y catar vino en Puntalarga en la tarde…'
              }
              className="mt-3 w-full rounded-2xl border border-tinta/15 bg-lana p-3.5 text-sm text-tinta placeholder:text-tinta-soft focus:border-grana focus:outline-none"
            />
            {(placeIds.length > 0 || festivalIds.length > 0 || notes.trim()) && (
              <button
                type="button"
                onClick={clearAll}
                className="no-print mt-3 text-xs font-medium text-tinta-muted underline hover:text-grana"
              >
                {lang === 'en' ? 'Clear itinerary' : 'Vaciar itinerario'}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
