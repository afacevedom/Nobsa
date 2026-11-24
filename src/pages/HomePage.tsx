import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Compass, MapPin, Sparkles } from 'lucide-react';
import { FESTIVALS } from '../data/festivals';
import { PLACE_CATEGORIES, PLACES } from '../data/places';
import { FESTIVAL_EN, PLACE_EN } from '../i18n/translations';
import type { PlaceCategory } from '../types/nobsa';
import { useLanguage } from '../context/LanguageContext';
import { EditorialImage } from '../components/ui/EditorialImage';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StoryModal } from '../components/interactive/StoryModal';
import { NobsaLivePulse } from '../components/interactive/NobsaLivePulse';
import { NobsaMap } from '../components/interactive/NobsaMap';
import { NavigationActions } from '../components/interactive/NavigationActions';
import { AudioNarrator } from '../components/interactive/AudioNarrator';
import { SeoHead } from '../components/seo/SeoHead';

const PILLARS = [
  {
    id: 'telar',
    code: '01 · EL TELAR',
    codeEn: '01 · THE LOOM',
    title: 'La ruana y los oficios en lana, piedra y metal',
    titleEn: 'Wool ruanas, carved stone & forged ironwork',
    body: 'Más de 25 artesanos y sus familias tejen en lana la prenda emblemática de Nobsa, junto a una comunidad experta en forja, talla en madera y piedra, muebles rústicos, cerámica y campanas artesanales.',
    bodyEn:
      'More than 25 artisan families hand-weave Nobsa’s signature wool ruana alongside workshops specializing in forged iron, stone and wood carving, ceramics, and handcrafted bells.',
    metric: '35 × 20 m · Ruana récord',
    image: 'NataliaParisRuana.jpg',
    imageAlt: 'Ruana tejida en lana de Nobsa',
    to: '/oficios',
  },
  {
    id: 'vid',
    code: '02 · LA VID Y EL CERRO',
    codeEn: '02 · VINE & PEAK',
    title: 'El Valle del Sol y la ruta hacia la Cruz de Aranda',
    titleEn: 'Valle del Sol vineyards & the Cruz de Aranda trail',
    body: 'Entre las catas del Viñedo Marqués de Puntalarga y los senderos que suben desde la Capilla de Lourdes hasta el cerro El Tungón, Nobsa revela un paisaje de montaña luminoso y caminable.',
    bodyEn:
      'Between highland tastings at Marqués de Puntalarga Vineyard and trails climbing past Lourdes Chapel to El Tungón summit, Nobsa opens up to hikers and cyclists.',
    metric: '3 h a pie · Cerro El Tungón',
    image: 'vinos.jpg',
    imageAlt: 'Viñedo Marqués de Puntalarga en Nobsa',
    to: '/territorio?lugar=vino',
  },
  {
    id: 'fragua',
    code: '03 · LA FRAGUA',
    codeEn: '03 · THE FORGE',
    title: 'El corredor siderúrgico y cementero del Sugamuxi',
    titleEn: 'Sugamuxi’s steel & cement industrial corridor',
    body: 'Sobre la Carretera Central del Norte conviven la tradición campesina y la gran industria pesada de Boyacá: Acerías Paz del Río (1948) y Cementos Holcim transformaron la historia económica del valle.',
    bodyEn:
      'Along the Central Northern Highway, rural heritage coexists with Boyacá’s heavy industry: Acerías Paz del Río (1948) and Holcim reshaped the valley’s modern economy.',
    metric: '195 km al norte de Bogotá',
    image: 'desde-la-capilla-de-lourdes.jpg',
    imageAlt: 'Vista panorámica de Nobsa y el valle del Alto Chicamocha',
    to: '/historia',
  },
];

export function HomePage() {
  const [activePillar, setActivePillar] = useState(0);
  const [legendOpen, setLegendOpen] = useState(false);
  const [mapCategory, setMapCategory] = useState<'todos' | PlaceCategory>('todos');
  const [mapSelectedId, setMapSelectedId] = useState<string>(PLACES[0].id);
  const { lang, t } = useLanguage();

  const cruzPlace = PLACES.find((p) => p.id === 'cruz');

  const homeMapPlaces = useMemo(
    () =>
      mapCategory === 'todos'
        ? PLACES
        : PLACES.filter((p) => p.categories.includes(mapCategory)),
    [mapCategory]
  );

  const activeMapPlace =
    PLACES.find((p) => p.id === mapSelectedId) || homeMapPlaces[0] || PLACES[0];

  const homeJsonLd = useMemo(
    () => [
      {
        '@type': 'TouristDestination',
        name: 'Nobsa, Boyacá',
        description:
          'Municipio del Alto Chicamocha en Boyacá, Colombia, reconocido por sus ruanas en lana virgen, el Viñedo Marqués de Puntalarga, la Cruz de Aranda y su patrimonio desde 1593.',
        url: 'https://afacevedom.github.io/Nobsa/',
        image: 'https://afacevedom.github.io/Nobsa/imagenes/Parque.jpg',
        geo: { '@type': 'GeoCoordinates', latitude: 5.7697, longitude: -72.94 },
        containsPlace: PLACES.filter((p) => p.lat !== null && p.lon !== null).map((p) => ({
          '@type': 'TouristAttraction',
          name: p.name,
          description: p.summary,
          geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lon },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio — Nobsa, Boyacá',
            item: 'https://afacevedom.github.io/Nobsa/',
          },
        ],
      },
    ],
    []
  );

  return (
    <div>
      <SeoHead
        title="Nobsa, Boyacá — Crónica de Lana, Piedra y Vid | Guía Cultural y Turística"
        description="Descubre Nobsa, Boyacá (Colombia): ruanas tejidas a mano, Viñedo Marqués de Puntalarga, Cruz de Aranda, mapa OpenStreetMap interactivo con Google Maps y Waze, historia desde 1593, clima en vivo y dólar hoy."
        path=""
        keywords="Nobsa Boyacá, turismo Nobsa, ruana de Nobsa, Viñedo Marqués de Puntalarga, Cruz de Aranda, mapa OpenStreetMap Nobsa, clima Nobsa hoy, Alto Chicamocha, Sugamuxi"
        jsonLd={homeJsonLd}
      />

      {/* PORTADA EDITORIAL ASIMÉTRICA */}
      <section className="relative overflow-hidden border-b border-tinta/10 bg-paper-grid">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-tinta/15 bg-lana-soft px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-tinta-muted sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-grana" aria-hidden="true" />
              {t.heroBadge}
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-tinta sm:text-6xl lg:text-[4.5rem]">
              {t.heroTitleTop}
              <br />
              <span className="font-normal italic text-grana">{t.heroTitleAccent}</span>{' '}
              {t.heroTitleEnd}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-tinta-muted sm:text-base lg:text-lg">
              {t.heroLead}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#mapa-portada"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-tinta px-5 py-3 text-sm font-medium text-lana transition hover:bg-grana sm:px-6"
              >
                <Compass className="h-4 w-4" />
                {t.heroCtaMap}
              </a>
              <Link
                to="/oficios"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-tinta/20 bg-lana-soft px-5 py-3 text-sm font-medium text-tinta transition hover:border-tinta sm:px-6"
              >
                {t.heroCtaCrafts}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-9 grid grid-cols-3 gap-3 border-t border-tinta/15 pt-5 sm:gap-6 sm:pt-6">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  {t.heroKpiFoundation}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  1593
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  {t.heroKpiRural}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  67,9 %
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  {t.heroKpiTunja}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  71 km
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-tinta/15 bg-tinta shadow-editorial">
              <EditorialImage
                filename="Parque.jpg"
                alt="Parque Principal de Nobsa con palmeras y arquitectura tradicional boyacense"
                caption={t.heroPhotoCaption}
                credit="Archivo fotográfico Nobsa · Felipe Acevedo (500px)"
                priority
                zoomable
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/90 via-tinta/40 to-transparent p-5 text-lana sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-trigo-soft sm:text-[11px]">
                  {t.heroPhotoTag}
                </p>
                <p className="mt-1 font-display text-lg sm:text-xl">{t.heroPhotoCaption}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Link
                to="/territorio?lugar=cruz"
                className="group flex items-center justify-between rounded-2xl border border-tinta/10 bg-lana-soft p-4 transition hover:border-grana"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-grana">
                    {lang === 'en' ? 'Oral legend · 1886' : 'Leyenda oral · 1886'}
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-tinta">
                    Cruz de Aranda
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-tinta-muted transition group-hover:text-grana" />
              </Link>
              <Link
                to="/mi-visita"
                className="group flex items-center justify-between rounded-2xl border border-tinta/10 bg-lana-soft p-4 transition hover:border-grana"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-musgo">
                    {lang === 'en' ? 'Custom route · GPX & PDF' : 'Itinerario · GPX y PDF'}
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-tinta">
                    {t.navFull.planner}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-tinta-muted transition group-hover:text-grana" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL EN VIVO: OPEN-METEO CLIMA (12h) + TRM DÓLAR (7d) + AIRE/UV & PUENTES CO + RECOMENDADOR */}
      <NobsaLivePulse />

      {/* MAPA INTERACTIVO OPENSTREETMAP VISIBLE EN PORTADA */}
      <section id="mapa-portada" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              index="01"
              eyebrow={lang === 'en' ? 'Interactive OpenStreetMap' : 'Cartografía abierta en vivo'}
              title={
                lang === 'en'
                  ? 'Explore Nobsa on OpenStreetMap'
                  : 'Explora Nobsa en OpenStreetMap'
              }
              lead={
                lang === 'en'
                  ? 'Switch between standard map, topographic terrain for mountain trails, or satellite view, and launch turn-by-turn directions in Google Maps or Waze.'
                  : 'Alterna entre vista estándar, relieve topográfico para senderos de montaña o imagen satelital, y abre indicaciones directas hacia cada punto en Google Maps o Waze.'
              }
            />
            <Link
              to="/territorio"
              className="inline-flex min-h-[42px] shrink-0 items-center gap-2 self-start rounded-full bg-tinta px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-lana transition hover:bg-grana lg:self-auto"
            >
              {lang === 'en' ? 'Full map, GPX & directions' : 'Mapa completo, rutas GPX y cómo llegar'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Filtros rápidos sobre el mapa de portada */}
        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filtrar pines en portada">
          <button
            type="button"
            onClick={() => setMapCategory('todos')}
            aria-pressed={mapCategory === 'todos'}
            className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              mapCategory === 'todos'
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
              onClick={() => setMapCategory(cat)}
              aria-pressed={mapCategory === cat}
              className={`inline-flex min-h-[36px] items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                mapCategory === cat
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

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <NobsaMap
              places={homeMapPlaces}
              selectedId={activeMapPlace.id}
              onSelect={setMapSelectedId}
              heightClass="h-[340px] sm:h-[440px] lg:h-[500px]"
            />
          </div>

          <aside className="flex flex-col overflow-hidden rounded-3xl border border-tinta/15 bg-lana-soft shadow-editorial lg:col-span-4">
            <EditorialImage
              filename={activeMapPlace.image}
              alt={activeMapPlace.imageAlt}
              caption={activeMapPlace.name}
              zoomable={Boolean(activeMapPlace.image)}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-grana">
                #{activeMapPlace.number} · {activeMapPlace.highlightTag}
              </span>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-tinta">
                {lang === 'en' && PLACE_EN[activeMapPlace.id]
                  ? PLACE_EN[activeMapPlace.id].name
                  : activeMapPlace.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-tinta-muted">
                {lang === 'en' && PLACE_EN[activeMapPlace.id]
                  ? PLACE_EN[activeMapPlace.id].summary
                  : activeMapPlace.summary}
              </p>

              {/* Navegación directa Llévame hasta aquí */}
              {activeMapPlace.lat !== null && activeMapPlace.lon !== null && (
                <div className="mt-5 border-t border-tinta/10 pt-4">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-tinta-soft">
                    {lang === 'en' ? 'Take me there' : 'Llévame hasta aquí'}
                  </p>
                  <NavigationActions
                    lat={activeMapPlace.lat}
                    lon={activeMapPlace.lon}
                    compact
                  />
                </div>
              )}

              <div className="mt-5 border-t border-tinta/10 pt-4">
                <Link
                  to={`/territorio?lugar=${activeMapPlace.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-grana hover:underline"
                >
                  {lang === 'en' ? 'Read full story & video' : 'Abrir ficha completa y video'}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* TRES HILOS DE UN MISMO TERRITORIO */}
      <section className="bg-tinta py-16 text-lana bg-loom-grid sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              index="02"
              eyebrow={lang === 'en' ? 'Territorial identity' : 'Identidad territorial'}
              title={
                lang === 'en'
                  ? 'Three threads that weave Nobsa’s character'
                  : 'Tres hilos que tejen el carácter de Nobsa'
              }
              lead={
                lang === 'en'
                  ? 'Few towns in Colombia bring together hand-loomed wool workshops, highland vineyards, and heavy steelworks within a few kilometers.'
                  : 'Pocos municipios colombianos articulan en tan pocos kilómetros la intimidad del telar artesanal, la viticultura de montaña y la escala de la industria siderúrgica.'
              }
              dark
            />
          </Reveal>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-6">
              {PILLARS.map((pillar, idx) => {
                const isActive = idx === activePillar;
                return (
                  <div
                    key={pillar.id}
                    className={`rounded-2xl border transition ${
                      isActive
                        ? 'border-trigo/70 bg-lana/10'
                        : 'border-lana/10 bg-lana/[0.03] hover:border-lana/25'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActivePillar(idx)}
                      aria-expanded={isActive}
                      className="w-full p-5 text-left sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs tracking-widest text-trigo-soft">
                          {lang === 'en' ? pillar.codeEn : pillar.code}
                        </span>
                        <span className="font-mono text-[11px] text-lana/60">{pillar.metric}</span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold text-lana sm:text-2xl">
                        {lang === 'en' ? pillar.titleEn : pillar.title}
                      </h3>
                    </button>
                    {isActive && (
                      <div className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="overflow-hidden rounded-2xl border border-lana/15 lg:hidden">
                          <EditorialImage
                            filename={pillar.image}
                            alt={pillar.imageAlt}
                            zoomable
                            className="aspect-[16/10] w-full object-cover"
                          />
                        </div>
                        <p className="text-sm leading-relaxed text-lana/80">
                          {lang === 'en' ? pillar.bodyEn : pillar.body}
                        </p>
                        <Link
                          to={pillar.to}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-trigo-soft hover:underline"
                        >
                          {lang === 'en' ? 'Explore chapter' : 'Explorar capítulo'}{' '}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:col-span-6 lg:block">
              <div className="overflow-hidden rounded-3xl border border-lana/15 bg-tinta">
                <EditorialImage
                  filename={PILLARS[activePillar].image}
                  alt={PILLARS[activePillar].imageAlt}
                  caption={lang === 'en' ? PILLARS[activePillar].titleEn : PILLARS[activePillar].title}
                  zoomable
                  className="aspect-[4/3] w-full object-cover transition duration-500"
                />
                <div className="flex items-center justify-between border-t border-lana/10 px-6 py-4 text-xs text-lana/70">
                  <span>{lang === 'en' ? PILLARS[activePillar].codeEn : PILLARS[activePillar].code}</span>
                  <span className="font-mono text-trigo-soft">{PILLARS[activePillar].metric}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRÓNICAS EDITORIALES ASIMÉTRICAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              index="03"
              eyebrow={lang === 'en' ? 'Essential stories' : 'Crónicas esenciales'}
              title={
                lang === 'en'
                  ? 'Essential stops to understand the town'
                  : 'Paradas imprescindibles para comprender el municipio'
              }
            />
            <Link
              to="/territorio"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-grana hover:underline"
            >
              {lang === 'en' ? 'See all 7 verified places' : 'Ver los 7 lugares verificados'}{' '}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-tinta/10 bg-lana-soft">
              <div className="overflow-hidden">
                <EditorialImage
                  filename="IglesiaNavidad.jpg"
                  alt="Iglesia municipal de Nobsa con torre en piedra tallada"
                  caption="Iglesia municipal de Nobsa (1898) — torre en piedra tallada y altar de Anselmo Zárate."
                  credit="Archivo fotográfico Nobsa · Felipe Acevedo (500px)"
                  zoomable
                  className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-grana">
                    Patrimonio · 1898
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                    La iglesia de piedra tallada y el altar de Anselmo Zárate
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-tinta-muted sm:text-base">
                    Tres naves de lenguaje dórico-barroco frente a un parque de cuatro círculos bajo palmeras. Guarda el lienzo de San Jerónimo atribuido a Francisco Zurbarán y el cuadro de San Roque, patrono del municipio.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/territorio?lugar=pueblo"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-tinta hover:text-grana"
                  >
                    Ver ficha y video del lugar <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal delay={0.08} className="flex-1">
              <article className="flex h-full flex-col justify-between rounded-3xl border border-tinta/10 bg-musgo p-6 text-lana sm:p-8">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
                      Tradición oral · Cerro El Tungón
                    </span>
                    <BookOpen className="h-4 w-4 shrink-0 text-trigo-soft" />
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold">
                    La Cruz de Aranda y el Diablo entre Dungua y Chacón
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-lana/80">
                    Levantada en 1886 en madera forrada de lata para devolver la tranquilidad al valle, reconstruida en cemento en 1931 y partida por un rayo en 1957. Hoy reúne a caminantes y ciclistas cada 1.º de mayo.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setLegendOpen(true)}
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full bg-lana px-4 py-2 text-xs font-semibold text-tinta transition hover:bg-trigo-soft"
                  >
                    {lang === 'en' ? 'Read & listen to legend' : 'Leer y escuchar la leyenda'}
                  </button>
                  <Link
                    to="/territorio?lugar=cruz"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-lana/25 px-4 py-2 text-xs font-medium text-lana hover:border-lana"
                  >
                    GPS / GPX <MapPin className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.14} className="flex-1">
              <article className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-tinta/10 bg-lana-soft p-6 sm:p-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-grana">
                    Mirador · Monte El Calvario
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-tinta">
                    Capilla de Nuestra Señora de Lourdes
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-tinta-muted">
                    A pocos pasos del casco urbano, este balcón natural regala la mejor panorámica del caserío y sirve de antesala deportiva hacia los cerros rurales.
                  </p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/territorio?lugar=capilla"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-tinta hover:text-grana"
                  >
                    Explorar en el mapa <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* UN AÑO EN NOBSA */}
      <section className="border-y border-tinta/10 bg-lana-deep/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeader
                index="04"
                eyebrow={lang === 'en' ? 'Living calendar' : 'Calendario vivo'}
                title={
                  lang === 'en' ? 'A year in the Alto Chicamocha' : 'Un año en el Alto Chicamocha'
                }
                lead={
                  lang === 'en'
                    ? 'From January wine tastings to December Christmas lights, every season reveals a different side of Nobsa.'
                    : 'Desde la vendimia de enero hasta las luces de diciembre, cada temporada revela una faceta distinta del municipio.'
                }
              />
              <Link
                to="/agenda"
                className="inline-flex min-h-[42px] items-center gap-2 self-start rounded-full bg-tinta px-5 py-3 text-xs font-medium uppercase tracking-wider text-lana transition hover:bg-grana md:self-auto"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {lang === 'en' ? 'View calendar & routes' : 'Ver calendario y rutas'}
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FESTIVALS.slice(0, 4).map((fest, i) => {
              const title = lang === 'en' && FESTIVAL_EN[fest.id] ? FESTIVAL_EN[fest.id].title : fest.title;
              const month =
                lang === 'en' && FESTIVAL_EN[fest.id] ? FESTIVAL_EN[fest.id].monthLabel : fest.monthLabel;
              const excerpt =
                lang === 'en' && FESTIVAL_EN[fest.id] ? FESTIVAL_EN[fest.id].excerpt : fest.excerpt;
              return (
                <Reveal key={fest.id} delay={i * 0.05}>
                  <Link
                    to={`/agenda?evento=${fest.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-tinta/10 bg-lana-soft transition hover:-translate-y-1 hover:shadow-editorial"
                  >
                    <EditorialImage
                      filename={fest.image}
                      alt={fest.imageAlt}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                        {month}
                      </span>
                      <h3 className="mt-1.5 font-display text-lg font-semibold text-tinta group-hover:text-grana">
                        {title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-tinta-muted">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {cruzPlace?.legend && (
        <StoryModal
          open={legendOpen}
          onClose={() => setLegendOpen(false)}
          eyebrow={cruzPlace.legend.subtitle}
          title={cruzPlace.legend.title}
        >
          <div className="mb-5">
            <AudioNarrator
              text={`${cruzPlace.legend.title}. ${cruzPlace.legend.paragraphs.join(' ')}`}
            />
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-tinta-muted sm:text-base">
            {cruzPlace.legend.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </StoryModal>
      )}
    </div>
  );
}
