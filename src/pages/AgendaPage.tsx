import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react';
import { FESTIVAL_CATEGORIES, FESTIVALS, SUGGESTED_JOURNEYS } from '../data/festivals';
import type { FestivalCategory } from '../types/nobsa';
import { EditorialImage } from '../components/ui/EditorialImage';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SeoHead } from '../components/seo/SeoHead';

export function AgendaPage() {
  const [searchParams] = useSearchParams();
  const highlightedEvent = searchParams.get('evento');
  const [filter, setFilter] = useState<'todos' | FestivalCategory>('todos');

  useEffect(() => {
    if (!highlightedEvent) return;
    const el = document.getElementById(highlightedEvent);
    if (el) {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [highlightedEvent]);

  const visibleFestivals =
    filter === 'todos' ? FESTIVALS : FESTIVALS.filter((f) => f.category === filter);

  const agendaJsonLd = useMemo(
    () => [
      {
        '@type': 'CollectionPage',
        name: 'Calendario de Festividades y Recorridos en Nobsa, Boyacá',
        description:
          'Fechas clave para visitar Nobsa: Festival de la Vid y el Vino, Semana Mayor, Cruz de Aranda, Día Mundial de la Ruana, San Roque, Festival Vallenato y Navidad.',
        url: 'https://afacevedom.github.io/Nobsa/#/agenda',
      },
      {
        '@type': 'ItemList',
        name: 'Festividades anuales de Nobsa',
        itemListElement: FESTIVALS.map((f, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Event',
            name: f.title,
            description: f.fullText,
            location: {
              '@type': 'Place',
              name: 'Nobsa, Boyacá',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nobsa',
                addressRegion: 'Boyacá',
                addressCountry: 'CO',
              },
            },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://afacevedom.github.io/Nobsa/' },
          { '@type': 'ListItem', position: 2, name: 'Agenda y Rutas', item: 'https://afacevedom.github.io/Nobsa/#/agenda' },
        ],
      },
    ],
    []
  );

  return (
    <div>
      <SeoHead
        title="Qué Hacer en Nobsa: Festividades y Rutas | Nobsa, Boyacá"
        description="Calendario anual de Nobsa, Boyacá: Festival de la Vid y el Vino en enero, Cruz de Aranda el 1.º de mayo, Día Mundial de la Ruana, San Roque, Festival Vallenato en noviembre y Navidad."
        path="/agenda"
        keywords="qué hacer en Nobsa, fiestas de Nobsa, Día Mundial de la Ruana, Festival Vallenato de Nobsa, Festival de la Vid y el Vino Puntalarga, alumbrado navideño Nobsa"
        image="https://afacevedom.github.io/Nobsa/imagenes/ArbolNavidad.jpg"
        imageAlt="Temporada navideña y alumbrado en Nobsa, Boyacá"
        jsonLd={agendaJsonLd}
      />

      {/* Cabecera */}
      <section className="border-b border-tinta/10 bg-paper-grid py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            as="h1"
            index="05"
            eyebrow="Calendario y experiencias"
            title="Un año de festividades y recorridos en Nobsa"
            lead="Cada mes del calendario nobsano convoca una celebración distinta: vino en enero, fe en Semana Mayor y mayo, lana a mitad de año, acordeón en noviembre y luces en diciembre."
          />

          <div className="mt-7 flex flex-wrap gap-2 sm:mt-8" role="group" aria-label="Filtrar festividades">
            <button
              type="button"
              onClick={() => setFilter('todos')}
              aria-pressed={filter === 'todos'}
              className={`min-h-[38px] rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === 'todos'
                  ? 'bg-tinta text-lana'
                  : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
              }`}
            >
              Todo el año ({FESTIVALS.length})
            </button>
            {(Object.keys(FESTIVAL_CATEGORIES) as FestivalCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`min-h-[38px] rounded-full px-4 py-2 text-xs font-medium transition ${
                  filter === cat
                    ? 'bg-tinta text-lana'
                    : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:text-tinta'
                }`}
              >
                {FESTIVAL_CATEGORIES[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista editorial de festividades */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="space-y-6">
          {visibleFestivals.map((fest) => {
            const isHighlighted = fest.id === highlightedEvent;
            return (
              <Reveal key={fest.id}>
                <article
                  id={fest.id}
                  className={`grid overflow-hidden rounded-3xl border bg-lana-soft transition lg:grid-cols-12 ${
                    isHighlighted ? 'border-grana ring-2 ring-grana/25' : 'border-tinta/10'
                  }`}
                >
                  <div className="lg:col-span-4">
                    <EditorialImage
                      filename={fest.image}
                      alt={fest.imageAlt}
                      className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[240px]"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-grana px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-lana">
                          <Calendar className="h-3 w-3" />
                          <time>{fest.monthLabel}</time>
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-tinta-soft">
                          {FESTIVAL_CATEGORIES[fest.category]}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                        {fest.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-tinta-muted sm:text-base">
                        {fest.fullText}
                      </p>
                    </div>

                    {fest.relatedPlaceId && (
                      <div className="mt-6 border-t border-tinta/10 pt-4">
                        <Link
                          to={`/territorio?lugar=${fest.relatedPlaceId}`}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tinta hover:text-grana"
                        >
                          <MapPin className="h-3.5 w-3.5 text-grana" />
                          Ver escenario en el mapa interactivo
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* RECORRIDOS SUGERIDOS */}
      <section id="recorridos" className="border-t border-tinta/10 bg-tinta py-14 text-lana bg-loom-grid sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="06"
            eyebrow="Itinerarios prácticos"
            title="Tres maneras de recorrer Nobsa"
            lead="Rutas sugeridas a partir de los lugares verificados del municipio, pensadas según el tiempo y el ritmo de tu visita."
            dark
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {SUGGESTED_JOURNEYS.map((journey) => (
              <article
                key={journey.id}
                className="flex flex-col rounded-3xl border border-lana/15 bg-lana/[0.05] p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-trigo-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {journey.duration}
                  </span>
                  <span className="text-lana/65">{journey.pace}</span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-semibold text-lana">
                  {journey.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-lana/75">{journey.summary}</p>

                <ol className="mt-6 flex-1 space-y-4 border-t border-lana/15 pt-5">
                  {journey.stops.map((stop, idx) => (
                    <li key={stop.placeId} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-trigo font-mono text-xs font-semibold text-tinta">
                        {idx + 1}
                      </span>
                      <div>
                        <Link
                          to={`/territorio?lugar=${stop.placeId}`}
                          className="font-medium text-lana hover:text-trigo-soft"
                        >
                          {stop.label}
                        </Link>
                        <p className="mt-0.5 text-xs leading-relaxed text-lana/70">{stop.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
