import { POPULATION_SERIES, URBAN_RURAL_SPLIT } from '../../data/demographics';

export function DemographicsCharts() {
  const maxPop = Math.max(...POPULATION_SERIES.map((d) => d.population));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Distribución Urbano / Rural */}
      <div className="rounded-2xl border border-tinta/10 bg-lana-soft p-5 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-grana">
              Territorio habitado
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-tinta">
              Distribución rural y urbana
            </h3>
          </div>
          <span className="font-mono text-xs text-tinta-muted">DANE 2020</span>
        </div>

        <div
          className="mt-6 flex h-5 w-full overflow-hidden rounded-full bg-lana-deep"
          role="img"
          aria-label="67,9 % población rural y 32,1 % población urbana"
        >
          <div
            className="h-full bg-musgo transition-all duration-700"
            style={{ width: `${URBAN_RURAL_SPLIT.ruralPct}%` }}
          />
          <div
            className="h-full bg-grana transition-all duration-700"
            style={{ width: `${URBAN_RURAL_SPLIT.urbanPct}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-lana p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-musgo" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-tinta-muted">
                Área rural
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-tinta">
              {URBAN_RURAL_SPLIT.ruralPct.toString().replace('.', ',')} %
            </p>
            <p className="mt-1 text-xs text-tinta-muted">
              11.169 hab. en 11 veredas y Belencito
            </p>
          </div>
          <div className="rounded-xl bg-lana p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-grana" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-tinta-muted">
                Área urbana
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-tinta">
              {URBAN_RURAL_SPLIT.urbanPct.toString().replace('.', ',')} %
            </p>
            <p className="mt-1 text-xs text-tinta-muted">
              5.277 hab. en la cabecera municipal
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-tinta-soft">{URBAN_RURAL_SPLIT.source}.</p>
      </div>

      {/* Evolución demográfica */}
      <div className="rounded-2xl border border-tinta/10 bg-lana-soft p-5 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-grana">
              Serie histórica
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-tinta">
              Crecimiento poblacional
            </h3>
          </div>
          <span className="font-mono text-xs text-tinta-muted">2005 – 2023</span>
        </div>

        <div className="mt-6 space-y-4">
          {POPULATION_SERIES.map((item) => {
            const widthPct = Math.round((item.population / maxPop) * 100);
            return (
              <div key={item.year}>
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-medium text-tinta">{item.year}</span>
                    <span className="text-xs text-tinta-muted">{item.note}</span>
                  </div>
                  <span className="font-mono font-semibold text-tinta">
                    {item.population.toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-lana-deep">
                  <div
                    className="h-full rounded-full bg-tinta"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
