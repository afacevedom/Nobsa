import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  DollarSign,
  Droplets,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react';
import {
  fetchDollarCop,
  fetchGdeltNews,
  fetchNobsaWeather,
  type DollarRateData,
  type GdeltNewsData,
  type NobsaWeatherData,
} from '../../services/liveApis';

const WEATHER_DOLLAR_REFRESH_MS = 60_000; // 60 s casi en tiempo real
const GDELT_REFRESH_MS = 180_000; // 3 min (respetando cuota compartida de GDELT)

function WeatherIcon({ kind, className }: { kind: NobsaWeatherData['conditionKind']; className?: string }) {
  switch (kind) {
    case 'sun':
      return <Sun className={className} />;
    case 'cloud-sun':
      return <CloudSun className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'fog':
      return <CloudFog className={className} />;
    case 'rain':
      return <CloudRain className={className} />;
    case 'storm':
      return <CloudLightning className={className} />;
  }
}

function getNobsaClock(): string {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota',
  }).format(new Date());
}

function formatTimeShort(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

interface NobsaLivePulseProps {
  compact?: boolean;
}

export function NobsaLivePulse({ compact = false }: NobsaLivePulseProps) {
  const [clock, setClock] = useState<string>(getNobsaClock);
  const [weather, setWeather] = useState<NobsaWeatherData | null>(null);
  const [weatherErr, setWeatherErr] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const [dollar, setDollar] = useState<DollarRateData | null>(null);
  const [dollarErr, setDollarErr] = useState<string | null>(null);
  const [dollarLoading, setDollarLoading] = useState(true);
  const [usdInput, setUsdInput] = useState<string>('50');

  const [newsScope, setNewsScope] = useState<'nobsa' | 'boyaca'>('nobsa');
  const [news, setNews] = useState<GdeltNewsData | null>(null);
  const [newsErr, setNewsErr] = useState<string | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);

  const [secondsLeft, setSecondsLeft] = useState(60);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchNobsaWeather();
      setWeather(data);
      setWeatherErr(null);
    } catch {
      setWeatherErr('No se pudo consultar Open-Meteo en este momento.');
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const loadDollar = useCallback(async () => {
    setDollarLoading(true);
    try {
      const data = await fetchDollarCop();
      setDollar(data);
      setDollarErr(null);
    } catch {
      setDollarErr('No se pudo obtener la tasa USD/COP.');
    } finally {
      setDollarLoading(false);
    }
  }, []);

  const loadNews = useCallback(async (scope: 'nobsa' | 'boyaca') => {
    setNewsLoading(true);
    try {
      const data = await fetchGdeltNews(scope);
      setNews(data);
      setNewsErr(null);
    } catch {
      setNewsErr('GDELT está ocupado en este momento. Intenta refrescar en unos segundos.');
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    setSecondsLeft(60);
    void loadWeather();
    void loadDollar();
    if (!compact) {
      void loadNews(newsScope);
    }
  }, [compact, loadDollar, loadNews, loadWeather, newsScope]);

  // Reloj local de Nobsa + cuenta regresiva de refresco
  useEffect(() => {
    const tick = window.setInterval(() => {
      setClock(getNobsaClock());
      setSecondsLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  // Carga inicial y refresco automático cada 60 s para Clima y Dólar
  useEffect(() => {
    void loadWeather();
    void loadDollar();

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        void loadWeather();
        void loadDollar();
        setSecondsLeft(60);
      }
    }, WEATHER_DOLLAR_REFRESH_MS);

    const onVisibility = () => {
      if (!document.hidden) {
        void loadWeather();
        void loadDollar();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loadWeather, loadDollar]);

  // Carga inicial y refresco cada 3 min para GDELT (solo en modo completo)
  useEffect(() => {
    if (compact) return;
    void loadNews(newsScope);
    const interval = window.setInterval(() => {
      if (!document.hidden) {
        void loadNews(newsScope);
      }
    }, GDELT_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [compact, loadNews, newsScope]);

  const parsedUsd = Math.max(0, Number(usdInput) || 0);
  const convertedCop = dollar ? parsedUsd * dollar.rateCop : 0;

  // Variante compacta para la página de Mapa y Territorio
  if (compact) {
    return (
      <div className="rounded-2xl border border-tinta/15 bg-lana-soft p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-musgo">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-musgo opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-musgo" />
              </span>
              Nobsa en vivo · {clock}
            </span>

            {weather && (
              <span className="inline-flex items-center gap-1.5 font-medium text-tinta">
                <WeatherIcon kind={weather.conditionKind} className="h-4 w-4 text-trigo" />
                {weather.temperature.toFixed(1)} °C · {weather.conditionLabel}
              </span>
            )}

            {dollar && (
              <span className="inline-flex items-center gap-1 font-medium text-tinta">
                <DollarSign className="h-3.5 w-3.5 text-grana" />
                1 USD = ${Math.round(dollar.rateCop).toLocaleString('es-CO')} COP
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={refreshAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-tinta/15 bg-lana px-3 py-1.5 font-mono text-[11px] text-tinta transition hover:border-grana hover:text-grana"
          >
            <RefreshCw className={`h-3 w-3 ${weatherLoading || dollarLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="nobsa-en-vivo-titulo"
      className="border-b border-tinta/10 bg-lana-deep/65 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado del pulso en vivo */}
        <div className="flex flex-col justify-between gap-4 border-b border-tinta/10 pb-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-musgo/30 bg-musgo/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-musgo">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-musgo opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-musgo" />
              </span>
              Datos en tiempo real · Boyacá
            </div>
            <h2
              id="nobsa-en-vivo-titulo"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-tinta sm:text-3xl lg:text-4xl"
            >
              Nobsa en vivo ahora mismo
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-tinta/10 bg-lana-soft px-3.5 py-2 font-mono text-xs text-tinta">
              <Clock className="h-3.5 w-3.5 text-grana" />
              <span>Hora local: {clock}</span>
            </span>
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-xs font-medium text-lana transition hover:bg-grana"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  weatherLoading || dollarLoading || newsLoading ? 'animate-spin' : ''
                }`}
              />
              Actualizar ({secondsLeft}s)
            </button>
          </div>
        </div>

        {/* Grid responsivo: 1 col móvil, 2 cols tablet, 12 cols escritorio */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* TARJETA 1: OPEN-METEO */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-lana-soft p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                  Clima · Open-Meteo
                </span>
                <span className="font-mono text-[10px] text-tinta-soft">
                  {formatTimeShort(weather?.fetchedAt ?? null)}
                </span>
              </div>

              {weatherLoading && !weather ? (
                <div className="mt-6 space-y-3 animate-pulse">
                  <div className="h-12 w-32 rounded-xl bg-lana-deep" />
                  <div className="h-4 w-48 rounded bg-lana-deep" />
                  <div className="h-16 w-full rounded-xl bg-lana-deep" />
                </div>
              ) : weatherErr && !weather ? (
                <p className="mt-6 text-sm text-tinta-muted">{weatherErr}</p>
              ) : weather ? (
                <>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-4xl font-semibold text-tinta sm:text-5xl">
                        {weather.temperature.toFixed(1)}°
                        <span className="text-xl font-normal text-tinta-muted">C</span>
                      </p>
                      <p className="mt-1 text-sm font-medium text-tinta">{weather.conditionLabel}</p>
                      <p className="text-xs text-tinta-muted">
                        Sensación {weather.apparentTemperature.toFixed(1)} °C · Nobsa
                      </p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lana-deep text-trigo">
                      <WeatherIcon kind={weather.conditionKind} className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-lana p-3.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-indigo-telar" />
                      <div>
                        <p className="text-tinta-soft">Humedad</p>
                        <p className="font-mono font-semibold text-tinta">{weather.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-musgo" />
                      <div>
                        <p className="text-tinta-soft">Viento</p>
                        <p className="font-mono font-semibold text-tinta">{weather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>

                  {/* Pronóstico 3 días */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {weather.forecast.map((day) => (
                      <div
                        key={day.date}
                        className="rounded-xl border border-tinta/10 bg-lana p-2.5 text-center"
                      >
                        <p className="font-mono text-[10px] uppercase text-tinta-soft">
                          {day.label}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-tinta">
                          {day.tempMax}° / {day.tempMin}°
                        </p>
                        <p className="mt-0.5 text-[10px] text-indigo-telar">
                          {day.precipProb}% lluvia
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <p className="mt-5 border-t border-tinta/10 pt-3 text-[11px] text-tinta-soft">
              Consejo de altura: lleva ruana de lana para el atardecer en el Alto Chicamocha.
            </p>
          </article>

          {/* TARJETA 2: PRECIO DEL DÓLAR EN COLOMBIA (USD -> COP) */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-lana-soft p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                  Dólar hoy · Colombia
                </span>
                <span className="font-mono text-[10px] text-tinta-soft">
                  {formatTimeShort(dollar?.fetchedAt ?? null)}
                </span>
              </div>

              {dollarLoading && !dollar ? (
                <div className="mt-6 space-y-3 animate-pulse">
                  <div className="h-12 w-44 rounded-xl bg-lana-deep" />
                  <div className="h-4 w-40 rounded bg-lana-deep" />
                  <div className="h-24 w-full rounded-xl bg-lana-deep" />
                </div>
              ) : dollarErr && !dollar ? (
                <p className="mt-6 text-sm text-tinta-muted">{dollarErr}</p>
              ) : dollar ? (
                <>
                  <div className="mt-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="font-display text-4xl font-semibold text-tinta sm:text-[2.6rem]">
                        ${dollar.rateCop.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <span className="font-mono text-xs uppercase text-tinta-muted">COP / USD</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {dollar.changeCop !== null && dollar.changePct !== null && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                            dollar.changeCop >= 0
                              ? 'bg-grana/10 text-grana'
                              : 'bg-musgo/15 text-musgo'
                          }`}
                        >
                          {dollar.changeCop >= 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {dollar.changeCop >= 0 ? '+' : ''}
                          {dollar.changeCop.toFixed(2)} ({dollar.changePct >= 0 ? '+' : ''}
                          {dollar.changePct.toFixed(2)}%)
                        </span>
                      )}
                      <span className="text-tinta-muted">Vigencia: {dollar.effectiveDate}</span>
                    </div>
                  </div>

                  {/* Conversor útil para viajeros y compras de artesanías */}
                  <div className="mt-5 rounded-2xl border border-tinta/10 bg-lana p-4">
                    <label
                      htmlFor="usd-converter-input"
                      className="block font-mono text-[10px] uppercase tracking-wider text-tinta-soft"
                    >
                      Calculadora rápida para viajeros (USD → COP)
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-tinta-muted">
                          US$
                        </span>
                        <input
                          id="usd-converter-input"
                          type="number"
                          min="0"
                          step="1"
                          value={usdInput}
                          onChange={(e) => setUsdInput(e.target.value)}
                          className="w-full rounded-xl border border-tinta/15 bg-lana-soft py-2 pl-10 pr-3 font-mono text-sm font-semibold text-tinta focus:border-grana focus:outline-none"
                        />
                      </div>
                      <span className="font-mono text-xs text-tinta-soft">=</span>
                      <div className="flex-1 rounded-xl bg-tinta px-3 py-2 text-right font-mono text-sm font-semibold text-lana">
                        ${Math.round(convertedCop).toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-tinta/10 pt-3 text-[11px] text-tinta-soft">
              <span className="truncate">{dollar?.sourceLabel || 'TRM Colombia'}</span>
              {dollar?.sourceUrl && (
                <a
                  href={dollar.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 font-mono text-grana hover:underline"
                >
                  Fuente <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>

          {/* TARJETA 3: GDELT DOC 2.0 (NOTICIAS EN VIVO) */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-tinta p-6 text-lana shadow-sm bg-loom-grid md:col-span-2 lg:col-span-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-trigo-soft">
                  <Newspaper className="h-3.5 w-3.5" />
                  Pulso mediático · GDELT
                </span>

                <div className="inline-flex rounded-full border border-lana/15 bg-lana/5 p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setNewsScope('nobsa')}
                    aria-pressed={newsScope === 'nobsa'}
                    className={`rounded-full px-2.5 py-1 font-mono transition ${
                      newsScope === 'nobsa' ? 'bg-trigo text-tinta font-semibold' : 'text-lana/75 hover:text-lana'
                    }`}
                  >
                    Nobsa
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsScope('boyaca')}
                    aria-pressed={newsScope === 'boyaca'}
                    className={`rounded-full px-2.5 py-1 font-mono transition ${
                      newsScope === 'boyaca' ? 'bg-trigo text-tinta font-semibold' : 'text-lana/75 hover:text-lana'
                    }`}
                  >
                    Boyacá
                  </button>
                </div>
              </div>

              {newsLoading && !news ? (
                <div className="mt-5 space-y-3 animate-pulse">
                  <div className="h-12 rounded-xl bg-lana/10" />
                  <div className="h-12 rounded-xl bg-lana/10" />
                  <div className="h-12 rounded-xl bg-lana/10" />
                </div>
              ) : newsErr && !news ? (
                <div className="mt-5 rounded-2xl border border-lana/15 bg-lana/5 p-4 text-xs text-lana/80">
                  <p>{newsErr}</p>
                  <button
                    type="button"
                    onClick={() => void loadNews(newsScope)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-trigo px-3 py-1.5 font-mono text-[11px] font-semibold text-tinta"
                  >
                    <RefreshCw className="h-3 w-3" /> Reintentar GDELT
                  </button>
                </div>
              ) : news && news.articles.length > 0 ? (
                <ul className="mt-4 divide-y divide-lana/10">
                  {news.articles.slice(0, 4).map((art) => (
                    <li key={art.url} className="py-3 first:pt-1 last:pb-0">
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <p className="line-clamp-2 text-xs font-medium leading-snug text-lana transition group-hover:text-trigo-soft sm:text-sm">
                          {art.title}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[10px] text-lana/60">
                          <span className="truncate">{art.domain}</span>
                          <span className="shrink-0">{art.seenDateFormatted}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-xs text-lana/75">
                  No se encontraron titulares recientes en esta ventana de GDELT. Prueba cambiar al filtro «Boyacá».
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-lana/15 pt-3 text-[11px] text-lana/60">
              <span>GDELT Project DOC 2.0 (refresco c/3 min)</span>
              <span className="font-mono">{formatTimeShort(news?.fetchedAt ?? null)}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
