import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Car,
  Compass,
  Download,
  MapPin,
  Play,
  Route as RouteIcon,
  Search,
} from 'lucide-react';
import { PLACE_CATEGORIES, PLACES } from '../data/places';
import { SUGGESTED_JOURNEYS } from '../data/festivals';
import { ACCESS_DATA, TERRITORY_BORDERS } from '../data/demographics';
import type { PlaceCategory } from '../types/nobsa';
import { formatCoords } from '../utils/assets';
import { downloadGpxFile, totalRouteDistanceKm } from '../utils/gpx';
import { NOBSA_CENTER_COORDS } from '../utils/navigation';
import { useVisitPlanner } from '../context/VisitPlannerContext';
import { useLanguage } from '../context/LanguageContext';
import { PLACE_EN } from '../i18n/translations';
import { NobsaMap } from '../components/interactive/NobsaMap';
import { NavigationActions } from '../components/interactive/NavigationActions';
import { EditorialImage } from '../components/ui/EditorialImage';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StoryModal } from '../components/interactive/StoryModal';
import { ShareButton } from '../components/interactive/ShareButton';
import { NobsaLivePulse } from '../components/interactive/NobsaLivePulse';
import { AudioNarrator } from '../components/interactive/AudioNarrator';
import { SeoHead } from '../components/seo/SeoHead';

type OriginPreset = 'current' | 'bogota' | 'tunja';

const ORIGIN_OPTIONS: Record<
  OriginPreset,
  { labelEs: string; labelEn: string; originQuery?: string; infoEs: string; infoEn: string }
> = {
  current: {
    labelEs: 'Mi ubicación actual',
    labelEn: 'My current location',
    originQuery: undefined,
    infoEs: 'Abre la ruta en tiempo real desde donde te encuentras directo al Parque Principal de Nobsa.',
    infoEn: 'Opens turn-by-turn directions from your current location straight to Nobsa’s Main Square.',
  },
  bogota: {
    labelEs: 'Desde Bogotá (195 km)',
    labelEn: 'From Bogotá (195 km)',
    originQuery: 'Bogotá, Colombia',
    infoEs: '195 km al norte de Bogotá por la Carretera Central del Norte hacia el corredor del Sugamuxi.',
    infoEn: '195 km north of Bogotá along the Central Northern Highway into the Sugamuxi valley.',
  },
  tunja: {
    labelEs: 'Desde Tunja (71 km)',
    labelEn: 'From Tunja (71 km)',
    originQuery: 'Tunja, Boyacá, Colombia',
    infoEs: '71 km desde la capital de Boyacá por la Carretera Central del Norte.',
    infoEn: '71 km northeast of Boyacá’s capital city along the Central Northern Highway.',
  },
};

export function TerritoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<'todos' | PlaceCategory>('todos');
  const [query, setQuery] = useState('');
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [originPreset, setOriginPreset] = useState<OriginPreset>('current');
  const [videoModalPlaceId, setVideoModalPlaceId] = useState<string | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const dossierRef = useRef<HTMLElement>(null);

  const { isPlaceSaved, togglePlace } = useVisitPlanner();
  const { lang, t } = useLanguage();

  const initialLugar = searchParams.get('lugar');
  const [selectedId, setSelectedId] = useState<string>(
    PLACES.some((p) => p.id === initialLugar) ? (initialLugar as string) : PLACES[0].id
  );

  useEffect(() => {
    const param = searchParams.get('lugar');
    if (param && PLACES.some((p) => p.id === param)) {
      setSelectedId(param);
    }
  }, [searchParams]);

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLACES.filter((place) => {
      const catMatch = category === 'todos' || place.categories.includes(category);
      const qMatch =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.summary.toLowerCase().includes(q) ||
        place.highlightTag.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [category, query]);

  const activeJourney = SUGGESTED_JOURNEYS.find((j) => j.id === activeJourneyId) || null;
  const activeRoutePlaces = useMemo(() => {
    if (!activeJourney) return [];
    return activeJourney.stops
      .map((s) => PLACES.find((p) => p.id === s.placeId))
      .filter((p): p is (typeof PLACES)[number] => Boolean(p));
  }, [activeJourney]);

  const selectedPlace =
    PLACES.find((p) => p.id === selectedId) || filteredPlaces[0] || PLACES[0];
  const placeSaved = isPlaceSaved(selectedPlace.id);

  const handleSelectPlace = (id: string, scrollMobile = false) => {
    setSelectedId(id);
    setSearchParams({ lugar: id }, { replace: true });
    if (scrollMobile && window.innerWidth < 1024 && dossierRef.current) {
      dossierRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const videoPlace = PLACES.find((p) => p.id === videoModalPlaceId) || null;

  const mapJsonLd = useMemo(
    () => [
      {
        '@type': 'CollectionPage',
        name: 'Mapa OpenStreetMap, rutas GPX y cómo llegar a Nobsa, Boyacá',
        description:
          'Ubicación, cómo llegar desde Bogotá y Tunja en Google Maps o Waze, descarga GPX y mapa OpenStreetMap con 7 atractivos verificados de Nobsa, Boyacá.',
        url: 'https://afacevedom.github.io/Nobsa/territorio/',
      },
      {
        '@type': 'ItemList',
        name: 'Lugares de interés en Nobsa',
        itemListElement: PLACES.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'TouristAttraction',
            name: p.name,
            description: p.summary,
            ...(p.lat !== null && p.lon !== null
              ? { geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lon } }
              : {}),
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://afacevedom.github.io/Nobsa/' },
          { '@type': 'ListItem', position: 2, name: 'Mapa y Territorio', item: 'https://afacevedom.github.io/Nobsa/territorio/' },
        ],
      },
    ],
    []
  );

  const displayName =
    lang === 'en' && PLACE_EN[selectedPlace.id]
      ? PLACE_EN[selectedPlace.id].name
      : selectedPlace.name;

  const currentOrigin = ORIGIN_OPTIONS[originPreset];

  return (
    <div>
      <SeoHead
        title={`${selectedPlace.name} — Mapa OpenStreetMap y Cómo Llegar a Nobsa, Boyacá`}
        description={`Mapa interactivo de Nobsa, Boyacá: ${selectedPlace.summary} A 195 km de Bogotá y 71 km de Tunja por la Carretera Central del Norte.`}
        path="/territorio"
        keywords="mapa de Nobsa, OpenStreetMap Nobsa, cómo llegar a Nobsa, dónde queda Nobsa Boyacá, Cruz de Aranda GPX, Viñedo Marqués de Puntalarga Google Maps Waze"
        jsonLd={mapJsonLd}
      />

      {/* Cabecera */}
      <section className="border-b border-tinta/10 bg-paper-grid py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              as="h1"
              index="03"
              eyebrow={lang === 'en' ? 'OpenStreetMap, GPX & Directions' : 'OpenStreetMap, rutas GPX y navegación'}
              title={lang === 'en' ? 'Interactive map of Nobsa' : 'Mapa interactivo de Nobsa'}
              lead={
                lang === 'en'
                  ? 'Explore seven verified landmarks across OpenStreetMap, Terrain, and Satellite views, download GPX files, or launch Google Maps and Waze directly.'
                  : 'Explora los siete hitos verificados en capas de OpenStreetMap, Relieve y Satélite, descarga rutas .GPX o inicia navegación directa en Google Maps y Waze.'
              }
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  downloadGpxFile(
                    activeJourney ? `nobsa-${activeJourney.id}.gpx` : 'nobsa-puntos-verificados.gpx',
                    activeJourney ? activeJourney.title : 'Nobsa — Puntos Verificados',
                    activeRoutePlaces.length >= 2 ? activeRoutePlaces : PLACES
                  )
                }
                className="inline-flex min-h-[38px] items-center gap-2 rounded-full bg-musgo px-4 py-2 text-xs font-semibold text-lana transition hover:bg-musgo-dark"
              >
                <Download className="h-3.5 w-3.5" />
                {t.downloadGpx}
              </button>
              <ShareButton
                title={`${selectedPlace.name} — Mapa de Nobsa`}
                text={selectedPlace.summary}
              />
            </div>
          </div>

          <div className="mt-6">
            <NobsaLivePulse compact />
          </div>

          {/* Selector de trazado en el mapa */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-tinta-muted">
              <RouteIcon className="h-3.5 w-3.5 text-grana" />
              {lang === 'en' ? 'Overlay route:' : 'Trazar ruta en mapa:'}
            </span>
            <button
              type="button"
              onClick={() => setActiveJourneyId(null)}
              aria-pressed={activeJourneyId === null}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeJourneyId === null
                  ? 'bg-grana text-lana'
                  : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
              }`}
            >
              {lang === 'en' ? 'Pins only' : 'Solo pines'}
            </button>
            {SUGGESTED_JOURNEYS.map((j) => {
              const active = activeJourneyId === j.id;
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setActiveJourneyId(j.id)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-grana text-lana'
                      : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
                  }`}
                >
                  {j.title}
                </button>
              );
            })}
            {activeRoutePlaces.length >= 2 && (
              <span className="font-mono text-[11px] text-musgo">
                · ~{totalRouteDistanceKm(activeRoutePlaces).toFixed(1)} km (tramo GPS)
              </span>
            )}
          </div>

          {/* Barra de filtros + buscador local */}
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar lugares por categoría">
              <button
                type="button"
                onClick={() => setCategory('todos')}
                aria-pressed={category === 'todos'}
                className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  category === 'todos'
                    ? 'bg-tinta text-lana'
                    : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
                }`}
              >
                Todos ({PLACES.length})
              </button>
              {(Object.keys(PLACE_CATEGORIES) as PlaceCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  className={`inline-flex min-h-[36px] items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    category === cat
                      ? 'bg-tinta text-lana'
                      : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: PLACE_CATEGORIES[cat].color }}
                    aria-hidden="true"
                  />
                  {PLACE_CATEGORIES[cat].label}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:w-64">
              <span className="sr-only">Filtrar lugares por texto</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-soft" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar lugar…"
                className="min-h-[40px] w-full rounded-full border border-tinta/15 bg-lana-soft py-2 pl-10 pr-4 text-xs text-tinta placeholder:text-tinta-soft focus:border-grana focus:outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Mapa OpenStreetMap sticky + Dossier sincronizado */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-20 lg:col-span-7">
            <NobsaMap
              places={filteredPlaces}
              selectedId={selectedPlace.id}
              onSelect={(id) => handleSelectPlace(id, false)}
              routePlaces={activeRoutePlaces}
              heightClass="h-[340px] sm:h-[460px] lg:h-[560px]"
            />

            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-tinta-muted">
                Directorio ({filteredPlaces.length} lugares)
              </h2>
              <ol className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {filteredPlaces.map((place) => {
                  const active = place.id === selectedPlace.id;
                  const pinColor = PLACE_CATEGORIES[place.categories[0]].color;
                  const itemLabel =
                    lang === 'en' && PLACE_EN[place.id] ? PLACE_EN[place.id].name : place.name;
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPlace(place.id, true)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                          active
                            ? 'border-tinta bg-tinta text-lana'
                            : 'border-tinta/10 bg-lana-soft text-tinta hover:border-grana/60'
                        }`}
                      >
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-lana"
                          style={{ backgroundColor: pinColor }}
                        >
                          {place.number}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{itemLabel}</span>
                          <span
                            className={`mt-0.5 block text-[11px] ${
                              active ? 'text-lana/70' : 'text-tinta-muted'
                            }`}
                          >
                            {place.lat !== null
                              ? place.highlightTag
                              : 'En lista · Pin GPS pendiente'}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <article
            ref={dossierRef}
            className="flex flex-col overflow-hidden rounded-3xl border border-tinta/15 bg-lana-soft shadow-editorial lg:col-span-5"
            aria-live="polite"
          >
            <EditorialImage
              filename={selectedPlace.image}
              alt={selectedPlace.imageAlt}
              caption={displayName}
              zoomable={Boolean(selectedPlace.image)}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-lana-deep px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-tinta"
                    >
                      {PLACE_CATEGORIES[cat].label}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => togglePlace(selectedPlace.id)}
                  aria-pressed={placeSaved}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    placeSaved
                      ? 'bg-musgo text-lana'
                      : 'border border-tinta/15 bg-lana text-tinta hover:border-grana hover:text-grana'
                  }`}
                >
                  {placeSaved ? (
                    <>
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      {t.savedPlace}
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5" />
                      {t.savePlace}
                    </>
                  )}
                </button>
              </div>

              <h2 className="mt-3 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                {displayName}
              </h2>

              {selectedPlace.lat !== null && selectedPlace.lon !== null ? (
                <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-grana">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {formatCoords(selectedPlace.lat, selectedPlace.lon)}
                </p>
              ) : (
                <p className="mt-2 font-mono text-xs text-tinta-muted">
                  Ubicación urbana general (sin coordenada puntual verificada).
                </p>
              )}

              <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-tinta-muted">
                {selectedPlace.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Bloque «Llévame hasta aquí» (Google Maps, Waze, OSM) */}
              {selectedPlace.lat !== null && selectedPlace.lon !== null && (
                <div className="mt-6 rounded-2xl border border-tinta/10 bg-lana p-4">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-grana">
                    {lang === 'en' ? 'Take me there (turn-by-turn)' : 'Llévame hasta aquí (ruta directa)'}
                  </p>
                  <NavigationActions lat={selectedPlace.lat} lon={selectedPlace.lon} />
                </div>
              )}

              {/* Acciones multimedia */}
              {(selectedPlace.videoId || selectedPlace.legend) && (
                <div className="mt-5 flex flex-wrap gap-2.5 border-t border-tinta/10 pt-5">
                  {selectedPlace.videoId && (
                    <button
                      type="button"
                      onClick={() => setVideoModalPlaceId(selectedPlace.id)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-grana px-4 py-2 text-xs font-semibold text-lana transition hover:bg-grana-dark"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Ver video del lugar
                    </button>
                  )}

                  {selectedPlace.legend && (
                    <button
                      type="button"
                      onClick={() => setLegendOpen(true)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-musgo px-4 py-2 text-xs font-semibold text-lana transition hover:bg-musgo-dark"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Leer y escuchar leyenda
                    </button>
                  )}
                </div>
              )}

              <p className="mt-5 text-[11px] leading-relaxed text-tinta-soft">
                Fuente cartográfica: {selectedPlace.sourceNote}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* CÓMO LLEGAR + INICIADOR DIRECTO EN GOOGLE MAPS / WAZE */}
      <section id="como-llegar" className="mt-10 border-t border-tinta/10 bg-lana-deep/55 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="04"
            eyebrow="Ubicación y conectividad"
            title="Cómo llegar a Nobsa"
            lead="Situado en el sector nororiental de Boyacá sobre la Carretera Central del Norte, en la región del Alto Chicamocha."
          />

          {/* Selector interactivo de origen para lanzar Google Maps o Waze */}
          <div className="mt-8 rounded-3xl border border-tinta/15 bg-lana-soft p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-grana">
                  <Car className="h-4 w-4" />
                  {lang === 'en' ? 'Direct road navigation' : 'Navegación directa por carretera'}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-tinta">
                  {lang === 'en'
                    ? 'Choose your starting point toward Nobsa'
                    : 'Elige tu punto de partida hacia el Parque Principal'}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Elegir punto de origen">
                  {(Object.keys(ORIGIN_OPTIONS) as OriginPreset[]).map((preset) => {
                    const active = originPreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setOriginPreset(preset)}
                        aria-pressed={active}
                        className={`min-h-[38px] rounded-full px-4 py-2 text-xs font-semibold transition ${
                          active
                            ? 'bg-tinta text-lana'
                            : 'border border-tinta/15 bg-lana text-tinta-muted hover:text-tinta'
                        }`}
                      >
                        {lang === 'en' ? ORIGIN_OPTIONS[preset].labelEn : ORIGIN_OPTIONS[preset].labelEs}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-sm text-tinta-muted">
                  {lang === 'en' ? currentOrigin.infoEn : currentOrigin.infoEs}
                </p>
              </div>

              <div className="shrink-0">
                <NavigationActions
                  lat={NOBSA_CENTER_COORDS.lat}
                  lon={NOBSA_CENTER_COORDS.lon}
                  origin={currentOrigin.originQuery}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACCESS_DATA.map((item) => (
              <div key={item.label} className="rounded-2xl border border-tinta/10 bg-lana-soft p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-grana">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-tinta">{item.value}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-tinta-muted">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-12 lg:items-center">
            <div className="rounded-3xl border border-tinta/10 bg-lana-soft p-6 sm:p-8 lg:col-span-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-grana">
                <Compass className="h-4 w-4" />
                Límites municipales
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <div className="rounded-xl bg-lana p-4">
                  <dt className="font-mono text-[11px] uppercase text-tinta-soft">Norte</dt>
                  <dd className="mt-1 font-medium text-tinta">{TERRITORY_BORDERS.north}</dd>
                </div>
                <div className="rounded-xl bg-lana p-4">
                  <dt className="font-mono text-[11px] uppercase text-tinta-soft">Oriente</dt>
                  <dd className="mt-1 font-medium text-tinta">{TERRITORY_BORDERS.east}</dd>
                </div>
                <div className="rounded-xl bg-lana p-4">
                  <dt className="font-mono text-[11px] uppercase text-tinta-soft">Sur</dt>
                  <dd className="mt-1 font-medium text-tinta">{TERRITORY_BORDERS.south}</dd>
                </div>
                <div className="rounded-xl bg-lana p-4">
                  <dt className="font-mono text-[11px] uppercase text-tinta-soft">Occidente</dt>
                  <dd className="mt-1 font-medium text-tinta">{TERRITORY_BORDERS.west}</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-tinta-muted">
                Nobsa hace parte de los 123 municipios de Boyacá (23.392 km² y 15 provincias) y conforma un eje estratégico de conexión con Bogotá, el corredor del Cusiana y la vía hacia la Costa Atlántica.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-tinta/15 lg:col-span-6">
              <EditorialImage
                filename="nobsamaps.png"
                alt="Vista aérea y contexto geográfico del municipio de Nobsa, Boyacá"
                zoomable
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <StoryModal
        open={Boolean(videoPlace && videoPlace.videoId)}
        onClose={() => setVideoModalPlaceId(null)}
        eyebrow="Registro audiovisual"
        title={videoPlace?.name || ''}
      >
        {videoPlace?.videoId && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-tinta">
              <iframe
                title={`Video sobre ${videoPlace.name}`}
                src={`https://www.youtube-nocookie.com/embed/${videoPlace.videoId}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <p className="text-xs text-tinta-muted">{videoPlace.summary}</p>
          </div>
        )}
      </StoryModal>

      {selectedPlace.legend && (
        <StoryModal
          open={legendOpen}
          onClose={() => setLegendOpen(false)}
          eyebrow={selectedPlace.legend.subtitle}
          title={selectedPlace.legend.title}
        >
          <div className="mb-5">
            <AudioNarrator
              text={`${selectedPlace.legend.title}. ${selectedPlace.legend.paragraphs.join(' ')}`}
            />
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-tinta-muted sm:text-base">
            {selectedPlace.legend.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </StoryModal>
      )}
    </div>
  );
}
