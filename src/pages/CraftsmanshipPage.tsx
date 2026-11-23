import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CRAFTS_AND_FLAVORS, RUANA_HIGHLIGHTS } from '../data/crafts';
import { EditorialImage } from '../components/ui/EditorialImage';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ShareButton } from '../components/interactive/ShareButton';
import { SeoHead } from '../components/seo/SeoHead';

type FilterType = 'todos' | 'textil' | 'oficio' | 'sabor';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'todos', label: 'Todos los oficios y sabores' },
  { id: 'textil', label: 'Ruana y fibras' },
  { id: 'oficio', label: 'Forja, talla y cerámica' },
  { id: 'sabor', label: 'Vino y sabores' },
];

export function CraftsmanshipPage() {
  const [filter, setFilter] = useState<FilterType>('todos');

  const items =
    filter === 'todos'
      ? CRAFTS_AND_FLAVORS
      : CRAFTS_AND_FLAVORS.filter((item) => item.category === filter);

  const pageJsonLd = useMemo(
    () => [
      {
        '@type': 'CollectionPage',
        name: 'Oficios y Sabores de Nobsa, Boyacá',
        description:
          'Catálogo editorial de la ruana en lana virgen, forja artesanal, talla en piedra y madera, campanas artesanales, vinos Marqués de Puntalarga y dulces de breva y uva.',
        url: 'https://afacevedom.github.io/Nobsa/#/oficios',
      },
      {
        '@type': 'ItemList',
        name: 'Artesanías y gastronomía de Nobsa',
        itemListElement: CRAFTS_AND_FLAVORS.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          description: item.description,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://afacevedom.github.io/Nobsa/' },
          { '@type': 'ListItem', position: 2, name: 'Oficios y Sabores', item: 'https://afacevedom.github.io/Nobsa/#/oficios' },
        ],
      },
    ],
    []
  );

  return (
    <div>
      <SeoHead
        title="La Ruana de Nobsa, Artesanías y Sabores | Nobsa, Boyacá"
        description="Conoce más de 25 talleres familiares de ruanas en lana de Nobsa, forja artesanal, campanas, talla en madera y piedra, vinos Marqués de Puntalarga y dulces de breva y uva."
        path="/oficios"
        keywords="ruana de Nobsa, artesanías Nobsa Boyacá, lana virgen, forja artesanal Nobsa, vinos Puntalarga, dulces de breva Nobsa"
        image="https://afacevedom.github.io/Nobsa/imagenes/NataliaParisRuana.jpg"
        imageAlt="Ruana tejida en lana tradicional de Nobsa, Boyacá"
        jsonLd={pageJsonLd}
      />

      {/* Cabecera editorial */}
      <section className="border-b border-tinta/10 bg-paper-grid py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
          <div className="lg:col-span-7">
            <SectionHeader
              as="h1"
              index="02"
              eyebrow="Artesanía, identidad y mesa"
              title="La ruana de Nobsa y el mosaico de sus oficios"
              lead="Desde la lana tejida en talleres familiares hasta la forja, las campanas artesanales, la talla en piedra y los vinos de Puntalarga, la cultura material de Nobsa se aprende mirando las manos de su gente."
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ShareButton
                title="Oficios y Sabores de Nobsa, Boyacá"
                text="Descubre la tradición de la ruana, la forja, la talla y el viñedo Marqués de Puntalarga en Nobsa."
              />
              <Link
                to="/agenda?evento=dia-mundial-ruana"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-tinta px-4 py-2 text-xs font-medium text-lana hover:bg-grana"
              >
                Día Mundial de la Ruana <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-tinta/15 shadow-editorial">
              <EditorialImage
                filename="NataliaParisRuana.jpg"
                alt="Ruana tejida en lana tradicional de Nobsa, Boyacá"
                priority
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cifras verificadas de la ruana */}
      <section className="bg-tinta py-12 text-lana bg-loom-grid sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6 lg:px-8">
          {RUANA_HIGHLIGHTS.map((stat) => (
            <div key={stat.value} className="rounded-2xl border border-lana/15 bg-lana/5 p-5 sm:p-6">
              <p className="font-display text-3xl font-semibold text-trigo-soft sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lana/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo filtrable de oficios y sabores */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar oficios y sabores"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`min-h-[38px] rounded-full px-4 py-2 text-xs font-medium transition sm:text-sm ${
                  active
                    ? 'bg-tinta text-lana'
                    : 'border border-tinta/15 bg-lana-soft text-tinta-muted hover:border-tinta hover:text-tinta'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.04}>
              <article
                id={item.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-tinta/10 bg-lana-soft"
              >
                {item.image && (
                  <EditorialImage
                    filename={item.image}
                    alt={item.imageAlt || item.name}
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                    {item.tagline}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-tinta">
                    {item.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-tinta-muted">
                    {item.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 sm:mt-16">
          <div className="grid gap-6 rounded-3xl border border-tinta/10 bg-lana-deep/70 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest text-grana">
                De la plaza al Valle del Sol
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                Dónde encontrarlos en tu recorrido
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-tinta-muted sm:text-base">
                Los talleres de ruanas, forja y talla se concentran en la zona urbana de Nobsa; los postres y dulces de frutas regionales rodean el Parque Principal, y hacia el occidente se ubica el Viñedo Marqués de Puntalarga, abierto a catas durante todo el año y sede del Festival de la Vid y el Vino en enero.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Link
                to="/territorio?lugar=ruanas"
                className="inline-flex min-h-[44px] items-center rounded-full bg-tinta px-5 py-3 text-sm font-medium text-lana hover:bg-grana"
              >
                Calle de Ruanas
              </Link>
              <Link
                to="/territorio?lugar=vino"
                className="inline-flex min-h-[44px] items-center rounded-full border border-tinta/20 bg-lana-soft px-5 py-3 text-sm font-medium text-tinta hover:border-tinta"
              >
                Viñedo Puntalarga
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
