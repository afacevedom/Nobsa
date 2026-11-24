import { useMemo, useState } from 'react';
import { HISTORICAL_CHAPTERS, TIMELINE_EVENTS } from '../data/history';
import { DEMOGRAPHIC_KPI, DEMOGRAPHIC_NOTES } from '../data/demographics';
import { useLanguage } from '../context/LanguageContext';
import { EditorialImage } from '../components/ui/EditorialImage';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DemographicsCharts } from '../components/ui/DemographicsCharts';
import { AudioNarrator } from '../components/interactive/AudioNarrator';
import { Reveal } from '../components/ui/Reveal';
import { SeoHead } from '../components/seo/SeoHead';

const ACCENT_STYLES = {
  grana: 'border-grana bg-grana text-lana',
  trigo: 'border-trigo bg-trigo text-tinta',
  musgo: 'border-musgo bg-musgo text-lana',
  indigo: 'border-indigo-telar bg-indigo-telar text-lana',
};

export function HistoryPeoplePage() {
  const [activeYearIdx, setActiveYearIdx] = useState(1);
  const { lang } = useLanguage();
  const activeMilestone = TIMELINE_EVENTS[activeYearIdx];

  const historyJsonLd = useMemo(
    () => [
      {
        '@type': 'Article',
        headline: 'Historia de Nobsa, Boyacá y retrato demográfico de su gente',
        description:
          'Cronología verificada de Nobsa desde 1539 y su fundación el 9 de enero de 1593 hasta la industria moderna y datos demográficos DANE/ASIS 2020.',
        inLanguage: 'es-CO',
        image: 'https://afacevedom.github.io/Nobsa/imagenes/desde-la-capilla-de-lourdes.jpg',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cuándo fue fundada Nobsa, Boyacá?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Nobsa fue fundada el sábado 9 de enero de 1593 por el hidalgo español Jerónimo Holguín en compañía de Misael Millán, y fue declarada municipio en 1811.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuántos habitantes tiene Nobsa y cómo se distribuyen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Según las proyecciones del Censo DANE 2018 para 2020 (ASIS Nobsa 2020), Nobsa registra 16.446 habitantes: 67,9 % en área rural (11 veredas y Belencito) y 32,1 % en la cabecera urbana.',
            },
          },
          {
            '@type': 'Question',
            name: '¿A cuántos kilómetros está Nobsa de Bogotá y Tunja?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Nobsa se encuentra a 195 km al norte de Bogotá y a 71 km de Tunja, capital de Boyacá, conectada por la Carretera Central del Norte.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://afacevedom.github.io/Nobsa/' },
          { '@type': 'ListItem', position: 2, name: 'Historia y Gente', item: 'https://afacevedom.github.io/Nobsa/historia/' },
        ],
      },
    ],
    []
  );

  const fullHistoryAudio = useMemo(
    () =>
      HISTORICAL_CHAPTERS.map((c) => `${c.title}. ${c.paragraphs.join(' ')}`).join(' '),
    []
  );

  return (
    <div>
      <SeoHead
        title="Historia de Nobsa (1593) y Demografía DANE | Nobsa, Boyacá"
        description="Historia verificada de Nobsa, Boyacá: resistencia del cacique Tundama (1539), fundación el 9 de enero de 1593, Acerías Paz del Río y retrato demográfico DANE (16.446 habitantes)."
        path="/historia"
        type="article"
        keywords="historia de Nobsa, fundación de Nobsa 1593, Jerónimo Holguín, cacique Tundama, habitantes de Nobsa DANE, Belencito Nobsa, Acerías Paz del Río"
        image="https://afacevedom.github.io/Nobsa/imagenes/desde-la-capilla-de-lourdes.jpg"
        imageAlt="Vista panorámica de Nobsa, Boyacá desde la Capilla de Lourdes"
        jsonLd={historyJsonLd}
      />

      <section className="border-b border-tinta/10 bg-paper-grid py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8">
          <div className="lg:col-span-7">
            <SectionHeader
              as="h1"
              index="04"
              eyebrow={lang === 'en' ? 'Memory & demographics' : 'Memoria y demografía'}
              title={
                lang === 'en'
                  ? 'History of Nobsa and portrait of its people'
                  : 'Historia de Nobsa y retrato de su gente'
              }
              lead="Desde la resistencia del cacique Tundama en 1539 y la fundación del 9 de enero de 1593 hasta la convivencia entre las 11 veredas rurales, Belencito y el corredor industrial."
            />
            <div className="mt-5">
              <AudioNarrator
                text={fullHistoryAudio}
                label={lang === 'en' ? 'Listen to historical chronicle (ES)' : 'Escuchar crónica histórica'}
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-tinta/15 shadow-editorial">
              <EditorialImage
                filename="desde-la-capilla-de-lourdes.jpg"
                alt="Panorámica histórica del casco urbano de Nobsa desde la Capilla de Lourdes"
                caption="Vista panorámica del casco urbano de Nobsa desde El Calvario."
                priority
                zoomable
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tinta py-14 text-lana bg-loom-grid sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-trigo-soft">
            Cronología verificada · 1539 – 1954
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Hitos que moldearon el municipio
          </h2>

          <div
            className="mt-7 flex snap-x gap-2 overflow-x-auto pb-2 sm:mt-8"
            role="tablist"
            aria-label="Años clave en la historia de Nobsa"
          >
            {TIMELINE_EVENTS.map((ev, idx) => {
              const selected = idx === activeYearIdx;
              return (
                <button
                  key={ev.year}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveYearIdx(idx)}
                  className={`min-h-[38px] shrink-0 snap-start rounded-full border px-4 py-2 font-mono text-xs font-medium transition ${
                    selected
                      ? ACCENT_STYLES[ev.accent]
                      : 'border-lana/20 bg-lana/5 text-lana/80 hover:border-lana/50'
                  }`}
                >
                  {ev.year}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="mt-6 rounded-3xl border border-lana/15 bg-lana/[0.06] p-5 sm:p-8"
          >
            <div className="grid gap-4 md:grid-cols-12 md:items-center md:gap-6">
              <div className="md:col-span-4">
                <span className="font-display text-4xl font-semibold text-trigo-soft sm:text-6xl">
                  {activeMilestone.year}
                </span>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-display text-2xl font-semibold text-lana sm:text-3xl">
                  {activeMilestone.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-lana/80 sm:text-base">
                  {activeMilestone.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            {HISTORICAL_CHAPTERS.map((ch) => (
              <Reveal key={ch.id}>
                <article className="border-b border-tinta/10 pb-10 last:border-0">
                  <p className="font-mono text-xs uppercase tracking-widest text-grana">
                    {ch.kicker}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                    {ch.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-tinta-muted sm:text-base">
                    {ch.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <aside className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <figure className="overflow-hidden rounded-2xl border border-tinta/10 bg-lana-soft">
              <EditorialImage
                filename="Historia1.jpg"
                alt="Fotografía histórica del municipio de Nobsa, Boyacá"
                zoomable
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-4 text-xs text-tinta-muted">
                Memoria gráfica del municipio: los archivos documentales antiguos de la alcaldía desaparecieron en las guerras civiles del siglo XIX y la Violencia de los años cuarenta.
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-2xl border border-tinta/10 bg-lana-soft">
              <EditorialImage
                filename="parque-principal-de-nobsa-boyacá.jpg"
                alt="Parque principal de Nobsa en la provincia del Sugamuxi"
                zoomable
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-4 text-xs text-tinta-muted">
                Plaza central de Nobsa, punto de encuentro entre la vida rural de sus 11 veredas y la cabecera municipal.
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>

      <section id="gente" className="border-t border-tinta/10 bg-lana-deep/55 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="05"
            eyebrow="Nuestra gente · DANE 2018 / ASIS 2020"
            title="Retrato demográfico de Nobsa"
            lead="Una población mayoritariamente rural con densidad concentrada en el corredor del Alto Chicamocha."
          />

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {DEMOGRAPHIC_KPI.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-tinta/10 bg-lana-soft p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-tinta-soft">
                  {kpi.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-tinta">
                  {kpi.value}{' '}
                  {kpi.unit && (
                    <span className="font-sans text-sm font-normal text-tinta-muted">
                      {kpi.unit}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-tinta-muted">{kpi.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <DemographicsCharts />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {DEMOGRAPHIC_NOTES.map((note) => (
              <article
                key={note.title}
                className="rounded-2xl border border-tinta/10 bg-lana-soft p-6"
              >
                <h3 className="font-display text-xl font-semibold text-tinta">{note.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tinta-muted">{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
