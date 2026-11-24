import { useMemo } from 'react';
import { ExternalLink, Mail, Radio, ShieldCheck } from 'lucide-react';
import { PROJECT_META, REFERENCE_SOURCES } from '../data/credits';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SeoHead } from '../components/seo/SeoHead';

const LIVE_API_CREDITS = [
  {
    name: 'Open-Meteo Weather API',
    role: 'Meteorología actual, curva horaria 12 h y pronóstico 3 días para Nobsa (5.7706, -72.9398)',
    url: 'https://open-meteo.com/',
  },
  {
    name: 'Datos Abiertos Colombia (TRM Superfinanciera) · DolarApi · Open ER-API',
    role: 'TRM oficial de Colombia (USD/COP) con serie histórica de 7 días y respaldos automáticos',
    url: 'https://www.datos.gov.co/Econom-a-y-Finanzas/Tasa-de-Cambio-Representativa-del-Mercado-TRM/32sa-8pi3',
  },
  {
    name: 'Open-Meteo Air Quality & UV API',
    role: 'Índice de calidad del aire (US AQI), material particulado PM2.5/PM10 e Índice UV en tiempo real para Nobsa',
    url: 'https://open-meteo.com/en/docs/air-quality-api',
  },
  {
    name: 'Nager.Date API · API-Colombia',
    role: 'Calendario en vivo de próximos festivos y puentes en Colombia para planear visitas a Nobsa',
    url: 'https://date.nager.at/',
  },
];

export function CreditsPage() {
  const creditsJsonLd = useMemo(
    () => [
      {
        '@type': 'AboutPage',
        name: 'Créditos editoriales y fuentes documentales — Nobsa, Boyacá',
        description:
          'Fuentes históricas, demográficas, cartográficas y APIs abiertas utilizadas en esta edición cultural independiente sobre Nobsa, Boyacá.',
        url: 'https://afacevedom.github.io/Nobsa/creditos/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://afacevedom.github.io/Nobsa/' },
          { '@type': 'ListItem', position: 2, name: 'Créditos', item: 'https://afacevedom.github.io/Nobsa/creditos/' },
        ],
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <SeoHead
        title="Créditos, Fuentes y APIs Abiertas | Nobsa, Boyacá"
        description="Bibliografía, documentos oficiales DANE/ASIS 2020, créditos fotográficos, cartografía OpenStreetMap y APIs abiertas (Open-Meteo Clima/Aire, TRM Colombia y Nager.Date Festivos)."
        path="/creditos"
        jsonLd={creditsJsonLd}
      />

      <SectionHeader
        as="h1"
        index="06"
        eyebrow="Transparencia y fuentes"
        title="Créditos editoriales y referencias documentales"
        lead="Toda la información histórica, demográfica, cartográfica y cultural de esta edición proviene de las fuentes documentadas del proyecto original y de servicios abiertos contrastados."
      />

      <div className="mt-8 rounded-3xl border border-grana/25 bg-grana/5 p-5 sm:mt-10 sm:p-8">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-grana" />
          <div>
            <h2 className="font-display text-xl font-semibold text-tinta">
              Publicación cultural independiente
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-tinta-muted">
              {PROJECT_META.editorialDisclaimer}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10 sm:mt-12">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-musgo">
          <Radio className="h-4 w-4" />
          Fuentes en vivo (sin servidor propio)
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold text-tinta">
          APIs públicas integradas
        </h2>
        <ul className="mt-5 divide-y divide-tinta/10 rounded-3xl border border-tinta/10 bg-lana-soft">
          {LIVE_API_CREDITS.map((api) => (
            <li
              key={api.name}
              className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <p className="break-words font-medium text-tinta">{api.name}</p>
                <p className="mt-1 text-xs text-tinta-muted">{api.role}</p>
              </div>
              <a
                href={api.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-tinta-muted hover:text-grana"
              >
                Documentación <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-tinta">
          Bibliografía, documentos y créditos fotográficos
        </h2>
        <ol className="mt-5 divide-y divide-tinta/10 rounded-3xl border border-tinta/10 bg-lana-soft">
          {REFERENCE_SOURCES.map((ref) => (
            <li
              key={ref.id}
              className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-wider text-grana">
                  {String(ref.id).padStart(2, '0')} · {ref.category}
                </span>
                <p className="mt-1 break-words font-medium text-tinta">{ref.title}</p>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-tinta-muted hover:text-grana"
              >
                Abrir fuente <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-tinta/10 bg-lana-soft p-6">
          <h3 className="font-display text-xl font-semibold text-tinta">
            Cartografía y licencia
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-tinta-muted">
            {PROJECT_META.mapAttribution} Las coordenadas de los lugares fueron contrastadas con OpenStreetMap, Wikiloc y Global Energy Monitor. La Calle de Ruanas y Artesanías se mantiene sin pin puntual hasta contar con una georreferenciación exacta.
          </p>
          <p className="mt-3 font-mono text-xs text-tinta-soft">
            Licencia del código: {PROJECT_META.licenseName}.
          </p>
        </div>

        <div className="rounded-3xl border border-tinta/10 bg-lana-soft p-6">
          <h3 className="font-display text-xl font-semibold text-tinta">Contacto del proyecto</h3>
          <p className="mt-3 text-sm leading-relaxed text-tinta-muted">
            ¿Deseas aportar fotografías con licencia compatible, corregir una coordenada o sugerir un taller artesanal de Nobsa?
          </p>
          <a
            href={`mailto:${PROJECT_META.contactEmail}`}
            className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full bg-tinta px-4 py-2.5 text-xs font-medium text-lana hover:bg-grana"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all">{PROJECT_META.contactEmail}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
