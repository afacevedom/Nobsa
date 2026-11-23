import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Compass, MapPin, Sparkles } from 'lucide-react';
import { FESTIVALS } from '../data/festivals';
import { PLACES } from '../data/places';
import { EditorialImage } from '../components/ui/EditorialImage';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StoryModal } from '../components/interactive/StoryModal';
import { NobsaLivePulse } from '../components/interactive/NobsaLivePulse';
import { SeoHead } from '../components/seo/SeoHead';

const PILLARS = [
  {
    id: 'telar',
    code: '01 · EL TELAR',
    title: 'La ruana y los oficios en lana, piedra y metal',
    body: 'Más de 25 artesanos y sus familias tejen en lana la prenda emblemática de Nobsa, junto a una comunidad experta en forja, talla en madera y piedra, muebles rústicos, cerámica y campanas artesanales.',
    metric: '35 × 20 m · Ruana récord',
    image: 'NataliaParisRuana.jpg',
    imageAlt: 'Ruana tejida en lana de Nobsa',
    to: '/oficios',
  },
  {
    id: 'vid',
    code: '02 · LA VID Y EL CERRO',
    title: 'El Valle del Sol y la ruta hacia la Cruz de Aranda',
    body: 'Entre las catas del Viñedo Marqués de Puntalarga y los senderos que suben desde la Capilla de Lourdes hasta el cerro El Tungón, Nobsa revela un paisaje de montaña luminoso y caminable.',
    metric: '3 h a pie · Cerro El Tungón',
    image: 'vinos.jpg',
    imageAlt: 'Viñedo Marqués de Puntalarga en Nobsa',
    to: '/territorio?lugar=vino',
  },
  {
    id: 'fragua',
    code: '03 · LA FRAGUA',
    title: 'El corredor siderúrgico y cementero del Sugamuxi',
    body: 'Sobre la Carretera Central del Norte conviven la tradición campesina y la gran industria pesada de Boyacá: Acerías Paz del Río (1948) y Cementos Holcim transformaron la historia económica del valle.',
    metric: '195 km al norte de Bogotá',
    image: 'desde-la-capilla-de-lourdes.jpg',
    imageAlt: 'Vista panorámica de Nobsa y el valle del Alto Chicamocha',
    to: '/historia',
  },
];

export function HomePage() {
  const [activePillar, setActivePillar] = useState(0);
  const [legendOpen, setLegendOpen] = useState(false);
  const cruzPlace = PLACES.find((p) => p.id === 'cruz');

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
        description="Descubre Nobsa, Boyacá (Colombia): ruanas tejidas a mano, Viñedo Marqués de Puntalarga, Cruz de Aranda, mapa interactivo, historia desde 1593, clima en vivo, dólar hoy y festividades."
        path=""
        keywords="Nobsa Boyacá, turismo Nobsa, ruana de Nobsa, Viñedo Marqués de Puntalarga, Cruz de Aranda, clima Nobsa hoy, Alto Chicamocha, Sugamuxi"
        jsonLd={homeJsonLd}
      />

      {/* PORTADA EDITORIAL ASIMÉTRICA */}
      <section className="relative overflow-hidden border-b border-tinta/10 bg-paper-grid">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-tinta/15 bg-lana-soft px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-tinta-muted sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-grana" aria-hidden="true" />
              Alto Chicamocha · Provincia del Sugamuxi
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-tinta sm:text-6xl lg:text-[4.5rem]">
              Nobsa:
              <br />
              <span className="font-normal italic text-grana">lana, piedra</span> y montaña.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-tinta-muted sm:text-base lg:text-lg">
              Fundada el 9 de enero de 1593 en el corazón de Boyacá, Nobsa reúne en un territorio breve la calma de su parque de cuatro círculos, el telar de sus ruanas, las cepas de Puntalarga y el pulso del corredor industrial.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/territorio"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-tinta px-5 py-3 text-sm font-medium text-lana transition hover:bg-grana sm:px-6"
              >
                <Compass className="h-4 w-4" />
                Abrir mapa interactivo
              </Link>
              <Link
                to="/oficios"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-tinta/20 bg-lana-soft px-5 py-3 text-sm font-medium text-tinta transition hover:border-tinta sm:px-6"
              >
                Descubrir la ruana
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-9 grid grid-cols-3 gap-3 border-t border-tinta/15 pt-5 sm:gap-6 sm:pt-6">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  Fundación
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  1593
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  Área rural
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  67,9 %
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-tinta-soft sm:text-[11px]">
                  Desde Tunja
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-tinta sm:text-2xl">
                  71 km
                </dd>
              </div>
            </dl>
          </div>

          {/* Composición fotográfica de gran formato */}
          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-tinta/15 bg-tinta shadow-editorial">
              <EditorialImage
                filename="Parque.jpg"
                alt="Parque Principal de Nobsa con palmeras y arquitectura tradicional boyacense"
                priority
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/90 via-tinta/40 to-transparent p-5 text-lana sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-trigo-soft sm:text-[11px]">
                  Casco urbano · Nobsa, Boyacá
                </p>
                <p className="mt-1 font-display text-lg sm:text-xl">
                  Parque Principal de los cuatro círculos e iglesia de 1898
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Link
                to="/territorio?lugar=cruz"
                className="group flex items-center justify-between rounded-2xl border border-tinta/10 bg-lana-soft p-4 transition hover:border-grana"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-grana">
                    Leyenda oral · 1886
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-tinta">
                    Cruz de Aranda
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-tinta-muted transition group-hover:text-grana" />
              </Link>
              <Link
                to="/agenda"
                className="group flex items-center justify-between rounded-2xl border border-tinta/10 bg-lana-soft p-4 transition hover:border-grana"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-musgo">
                    7 citas al año
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-tinta">
                    Agenda cultural
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-tinta-muted transition group-hover:text-grana" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL EN VIVO: OPEN-METEO + DÓLAR HOY + GDELT */}
      <NobsaLivePulse />

      {/* TRES HILOS DE UN MISMO TERRITORIO */}
      <section className="bg-tinta py-16 text-lana bg-loom-grid sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              index="01"
              eyebrow="Identidad territorial"
              title="Tres hilos que tejen el carácter de Nobsa"
              lead="Pocos municipios colombianos articulan en tan pocos kilómetros la intimidad del telar artesanal, la viticultura de montaña y la escala de la industria siderúrgica."
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
                          {pillar.code}
                        </span>
                        <span className="font-mono text-[11px] text-lana/60">{pillar.metric}</span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold text-lana sm:text-2xl">
                        {pillar.title}
                      </h3>
                    </button>
                    {isActive && (
                      <div className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="overflow-hidden rounded-2xl border border-lana/15 lg:hidden">
                          <EditorialImage
                            filename={pillar.image}
                            alt={pillar.imageAlt}
                            className="aspect-[16/10] w-full object-cover"
                          />
                        </div>
                        <p className="text-sm leading-relaxed text-lana/80">{pillar.body}</p>
                        <Link
                          to={pillar.to}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-trigo-soft hover:underline"
                        >
                          Explorar capítulo <ArrowRight className="h-3.5 w-3.5" />
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
                  className="aspect-[4/3] w-full object-cover transition duration-500"
                />
                <div className="flex items-center justify-between border-t border-lana/10 px-6 py-4 text-xs text-lana/70">
                  <span>{PILLARS[activePillar].code}</span>
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
              index="02"
              eyebrow="Crónicas esenciales"
              title="Paradas imprescindibles para comprender el municipio"
            />
            <Link
              to="/territorio"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-grana hover:underline"
            >
              Ver los 7 lugares verificados <ArrowRight className="h-3.5 w-3.5" />
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
                    Leer la leyenda completa
                  </button>
                  <Link
                    to="/territorio?lugar=cruz"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-lana/25 px-4 py-2 text-xs font-medium text-lana hover:border-lana"
                  >
                    Ubicación GPS <MapPin className="h-3.5 w-3.5" />
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
                index="03"
                eyebrow="Calendario vivo"
                title="Un año en el Alto Chicamocha"
                lead="Desde la vendimia de enero hasta las luces de diciembre, cada temporada revela una faceta distinta del municipio."
              />
              <Link
                to="/agenda"
                className="inline-flex min-h-[42px] items-center gap-2 self-start rounded-full bg-tinta px-5 py-3 text-xs font-medium uppercase tracking-wider text-lana transition hover:bg-grana md:self-auto"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ver calendario y rutas
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FESTIVALS.slice(0, 4).map((fest, i) => (
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
                      {fest.monthLabel}
                    </span>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-tinta group-hover:text-grana">
                      {fest.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-tinta-muted">
                      {fest.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
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
