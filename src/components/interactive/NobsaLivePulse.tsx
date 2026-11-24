import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  DollarSign,
  Droplets,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';
import {
  fetchColombiaHolidays,
  fetchDollarCop,
  fetchNobsaAirQuality,
  fetchNobsaWeather,
  getCachedAirQuality,
  getCachedDollar,
  getCachedHolidays,
  getCachedWeather,
  type ColombiaHolidaysData,
  type DollarRateData,
  type NobsaAirQualityData,
  type NobsaWeatherData,
} from '../../services/liveApis';
import { PLACES } from '../../data/places';
import { PLACE_EN } from '../../i18n/translations';
import { buildWeatherRecommendation } from '../../utils/weatherRecommender';
import { useLanguage } from '../../context/LanguageContext';
import { MiniSparkline } from './MiniSparkline';
import { NavigationActions } from './NavigationActions';

const LIVE_REFRESH_MS = 60_000;

function WeatherIcon({
  kind,
  className,
}: {
  kind: NobsaWeatherData['conditionKind'];
  className?: string;
}) {
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

function getAqiBadgeStyle(level: NobsaAirQualityData['aqiLevel']): string {
  switch (level) {
    case 'good':
      return 'bg-musgo text-lana';
    case 'moderate':
      return 'bg-trigo text-tinta';
    case 'sensitive':
      return 'bg-grana-light text-lana';
    case 'unhealthy':
      return 'bg-grana text-lana';
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
  const { lang, t } = useLanguage();
  const [clock, setClock] = useState<string>(getNobsaClock);

  const [weather, setWeather] = useState<NobsaWeatherData | null>(() => getCachedWeather());
  const [weatherErr, setWeatherErr] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(!weather);

  const [dollar, setDollar] = useState<DollarRateData | null>(() => getCachedDollar());
  const [dollarErr, setDollarErr] = useState<string | null>(null);
  const [dollarLoading, setDollarLoading] = useState(!dollar);
  const [usdInput, setUsdInput] = useState<string>('50');

  const [thirdTab, setThirdTab] = useState<'air' | 'holidays'>('air');
  const [air, setAir] = useState<NobsaAirQualityData | null>(() => getCachedAirQuality());
  const [airErr, setAirErr] = useState<string | null>(null);
  const [airLoading, setAirLoading] = useState(!air);

  const [holidays, setHolidays] = useState<ColombiaHolidaysData | null>(() => getCachedHolidays());
  const [holidaysErr, setHolidaysErr] = useState<string | null>(null);
  const [holidaysLoading, setHolidaysLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchNobsaWeather();
      setWeather(data);
      setWeatherErr(null);
    } catch {
      const cached = getCachedWeather();
      if (cached) setWeather(cached);
      else setWeatherErr('No se pudo consultar Open-Meteo en este momento.');
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
      const cached = getCachedDollar();
      if (cached) setDollar(cached);
      else setDollarErr('No se pudo obtener la tasa USD/COP.');
    } finally {
      setDollarLoading(false);
    }
  }, []);

  const loadAir = useCallback(async () => {
    setAirLoading(true);
    try {
      const data = await fetchNobsaAirQuality();
      setAir(data);
      setAirErr(null);
    } catch {
      const cached = getCachedAirQuality();
      if (cached) setAir(cached);
      else setAirErr('No se pudo consultar calidad del aire en este momento.');
    } finally {
      setAirLoading(false);
    }
  }, []);

  const loadHolidays = useCallback(async () => {
    setHolidaysLoading(true);
    try {
      const data = await fetchColombiaHolidays();
      setHolidays(data);
      setHolidaysErr(null);
    } catch {
      const cached = getCachedHolidays();
      if (cached) setHolidays(cached);
      else setHolidaysErr('No se pudieron cargar los festivos de Colombia.');
    } finally {
      setHolidaysLoading(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    setSecondsLeft(60);
    void loadWeather();
    void loadDollar();
    if (!compact) {
      void loadAir();
      if (thirdTab === 'holidays') {
        void loadHolidays();
      }
    }
  }, [compact, loadAir, loadDollar, loadHolidays, loadWeather, thirdTab]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setClock(getNobsaClock());
      setSecondsLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    void loadWeather();
    void loadDollar();
    if (!compact) {
      void loadAir();
    }

    const interval = window.setInterval(() => {
      if (!document.hidden && navigator.onLine) {
        void loadWeather();
        void loadDollar();
        if (!compact) {
          void loadAir();
        }
        setSecondsLeft(60);
      }
    }, LIVE_REFRESH_MS);

    const onOnline = () => {
      void loadWeather();
      void loadDollar();
      if (!compact) void loadAir();
    };
    window.addEventListener('online', onOnline);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', onOnline);
    };
  }, [compact, loadAir, loadDollar, loadWeather]);

  // Carga bajo demanda de festivos de Colombia al abrir la pestaña «Puentes CO»
  useEffect(() => {
    if (!compact && thirdTab === 'holidays' && !holidays) {
      void loadHolidays();
    }
  }, [compact, thirdTab, holidays, loadHolidays]);

  const parsedUsd = Math.max(0, Number(usdInput) || 0);
  const convertedCop = dollar ? parsedUsd * dollar.rateCop : 0;
  const weatherLabel = weather
    ? lang === 'en'
      ? weather.conditionLabelEn
      : weather.conditionLabel
    : '';

  const recommendation = useMemo(
    () => (weather ? buildWeatherRecommendation(weather, lang) : null),
    [weather, lang]
  );

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
              Nobsa · {clock}
            </span>

            {weather && (
              <span className="inline-flex items-center gap-1.5 font-medium text-tinta">
                <WeatherIcon kind={weather.conditionKind} className="h-4 w-4 text-trigo" />
                {weather.temperature.toFixed(1)} °C · {weatherLabel}
              </span>
            )}

            {recommendation && (
              <span className="hidden items-center gap-1.5 rounded-full bg-musgo/10 px-2.5 py-0.5 font-mono text-[11px] text-musgo xl:inline-flex">
                <Sparkles className="h-3 w-3" />
                {recommendation.badge}
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
            {t.liveRefresh}
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
        <div className="flex flex-col justify-between gap-4 border-b border-tinta/10 pb-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-musgo/30 bg-musgo/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-musgo">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-musgo opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-musgo" />
              </span>
              {t.liveBadge}
            </div>
            <h2
              id="nobsa-en-vivo-titulo"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-tinta sm:text-3xl lg:text-4xl"
            >
              {t.liveTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-tinta/10 bg-lana-soft px-3.5 py-2 font-mono text-xs text-tinta">
              <Clock className="h-3.5 w-3.5 text-grana" />
              <span>
                {t.liveLocalTime}: {clock}
              </span>
            </span>
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-xs font-medium text-lana transition hover:bg-grana"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  weatherLoading || dollarLoading || airLoading ? 'animate-spin' : ''
                }`}
              />
              {t.liveRefresh} ({secondsLeft}s)
            </button>
          </div>
        </div>

        {/* 3 TARJETAS EN VIVO (100 % CORS NATIVO SIN PROXIES) */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* TARJETA 1: OPEN-METEO CLIMA + CURVA 12 HORAS */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-lana-soft p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                  {t.weatherTitle}
                </span>
                <span className="font-mono text-[10px] text-tinta-soft">
                  {weather?.fromCache ? t.liveCachedNotice : formatTimeShort(weather?.fetchedAt ?? null)}
                </span>
              </div>

              {weatherLoading && !weather ? (
                <div className="mt-6 space-y-3 animate-pulse">
                  <div className="h-12 w-32 rounded-xl bg-lana-deep" />
                  <div className="h-14 w-full rounded-xl bg-lana-deep" />
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
                      <p className="mt-1 text-sm font-medium text-tinta">{weatherLabel}</p>
                      <p className="text-xs text-tinta-muted">
                        {t.weatherFeels} {weather.apparentTemperature.toFixed(1)} °C · Nobsa
                      </p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lana-deep text-trigo">
                      <WeatherIcon kind={weather.conditionKind} className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-lana p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-indigo-telar" />
                      <div>
                        <p className="text-tinta-soft">{t.weatherHumidity}</p>
                        <p className="font-mono font-semibold text-tinta">{weather.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-musgo" />
                      <div>
                        <p className="text-tinta-soft">{t.weatherWind}</p>
                        <p className="font-mono font-semibold text-tinta">{weather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>

                  {weather.hourly && weather.hourly.length >= 2 && (
                    <div className="mt-4 rounded-2xl border border-tinta/10 bg-lana p-3.5">
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-tinta-soft">
                        {t.weatherNext12h}
                      </p>
                      <MiniSparkline
                        points={weather.hourly.map((h) => ({
                          label: h.hourLabel,
                          value: h.temperature,
                        }))}
                        strokeColor="#C98E2B"
                        fillColor="rgba(201, 142, 43, 0.14)"
                        unitSuffix="°C"
                        ariaLabel="Temperatura por horas en Nobsa durante las próximas 12 horas"
                      />
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {weather.forecast.map((day) => (
                      <div
                        key={day.date}
                        className="rounded-xl border border-tinta/10 bg-lana p-2 text-center"
                      >
                        <p className="font-mono text-[10px] uppercase text-tinta-soft">
                          {day.label}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-tinta">
                          {day.tempMax}° / {day.tempMin}°
                        </p>
                        <p className="mt-0.5 text-[10px] text-indigo-telar">
                          {day.precipProb}%
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <p className="mt-4 border-t border-tinta/10 pt-3 text-[11px] text-tinta-soft">
              {t.weatherTip}
            </p>
          </article>

          {/* TARJETA 2: DÓLAR HOY + TENDENCIA 7 DÍAS */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-lana-soft p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-grana">
                  {t.dollarTitle}
                </span>
                <span className="font-mono text-[10px] text-tinta-soft">
                  {dollar?.fromCache ? t.liveCachedNotice : formatTimeShort(dollar?.fetchedAt ?? null)}
                </span>
              </div>

              {dollarLoading && !dollar ? (
                <div className="mt-6 space-y-3 animate-pulse">
                  <div className="h-12 w-44 rounded-xl bg-lana-deep" />
                  <div className="h-16 w-full rounded-xl bg-lana-deep" />
                  <div className="h-20 w-full rounded-xl bg-lana-deep" />
                </div>
              ) : dollarErr && !dollar ? (
                <p className="mt-6 text-sm text-tinta-muted">{dollarErr}</p>
              ) : dollar ? (
                <>
                  <div className="mt-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="font-display text-4xl font-semibold text-tinta sm:text-[2.5rem]">
                        $
                        {dollar.rateCop.toLocaleString('es-CO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
                      <span className="text-tinta-muted">
                        {t.dollarValid}: {dollar.effectiveDate}
                      </span>
                    </div>
                  </div>

                  {dollar.history && dollar.history.length >= 2 && (
                    <div className="mt-4 rounded-2xl border border-tinta/10 bg-lana p-3.5">
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-tinta-soft">
                        {t.dollarTrend7d}
                      </p>
                      <MiniSparkline
                        points={dollar.history.map((h) => ({
                          label: h.date,
                          value: h.rateCop,
                        }))}
                        strokeColor="#8F2429"
                        fillColor="rgba(143, 36, 41, 0.12)"
                        ariaLabel="Tendencia de la TRM en Colombia en los últimos 7 días"
                      />
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-tinta/10 bg-lana p-3.5">
                    <label
                      htmlFor="usd-converter-input"
                      className="block font-mono text-[10px] uppercase tracking-wider text-tinta-soft"
                    >
                      {t.dollarCalcLabel}
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
                          className="w-full rounded-xl border border-tinta/15 bg-lana-soft py-2 pl-10 pr-2 font-mono text-sm font-semibold text-tinta focus:border-grana focus:outline-none"
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

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-tinta/10 pt-3 text-[11px] text-tinta-soft">
              <span className="truncate">{dollar?.sourceLabel || 'TRM Colombia'}</span>
              {dollar?.sourceUrl && (
                <a
                  href={dollar.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 font-mono text-grana hover:underline"
                >
                  {t.dollarSource} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>

          {/* TARJETA 3: CALIDAD DEL AIRE & ÍNDICE UV (OPEN-METEO) + PUENTES FESTIVOS CO */}
          <article className="flex flex-col justify-between rounded-3xl border border-tinta/10 bg-tinta p-6 text-lana shadow-sm bg-loom-grid md:col-span-2 lg:col-span-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-trigo-soft">
                  {thirdTab === 'air' ? (
                    <>
                      <Sun className="h-3.5 w-3.5" />
                      {t.airTitle}
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-3.5 w-3.5" />
                      {t.holidaysTitle}
                    </>
                  )}
                </span>

                <div className="inline-flex rounded-full border border-lana/15 bg-lana/5 p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setThirdTab('air')}
                    aria-pressed={thirdTab === 'air'}
                    className={`rounded-full px-2.5 py-1 font-mono transition ${
                      thirdTab === 'air'
                        ? 'bg-trigo font-semibold text-tinta'
                        : 'text-lana/75 hover:text-lana'
                    }`}
                  >
                    {lang === 'en' ? 'Air & UV' : 'Aire y UV'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setThirdTab('holidays')}
                    aria-pressed={thirdTab === 'holidays'}
                    className={`rounded-full px-2.5 py-1 font-mono transition ${
                      thirdTab === 'holidays'
                        ? 'bg-trigo font-semibold text-tinta'
                        : 'text-lana/75 hover:text-lana'
                    }`}
                  >
                    {lang === 'en' ? 'CO Holidays' : 'Puentes CO'}
                  </button>
                </div>
              </div>

              {thirdTab === 'air' ? (
                airLoading && !air ? (
                  <div className="mt-6 space-y-3 animate-pulse">
                    <div className="h-12 w-36 rounded-xl bg-lana/10" />
                    <div className="h-14 w-full rounded-xl bg-lana/10" />
                    <div className="h-16 w-full rounded-xl bg-lana/10" />
                  </div>
                ) : airErr && !air ? (
                  <p className="mt-6 text-xs text-lana/80">{airErr}</p>
                ) : air ? (
                  <>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <p className="font-display text-4xl font-semibold text-lana sm:text-5xl">
                            {air.usAqi}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${getAqiBadgeStyle(
                              air.aqiLevel
                            )}`}
                          >
                            {lang === 'en' ? air.aqiLabelEn : air.aqiLabelEs}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-lana/70">
                          {lang === 'en'
                            ? 'US Air Quality Index · Alto Chicamocha'
                            : 'Índice Calidad del Aire (US AQI) · Nobsa'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-lana/15 bg-lana/10 px-3.5 py-2.5 text-center">
                        <p className="font-mono text-[10px] uppercase text-trigo-soft">UV</p>
                        <p className="font-display text-2xl font-semibold text-lana">
                          {air.uvIndex.toFixed(1)}
                        </p>
                        <p className="font-mono text-[10px] text-lana/70">
                          {lang === 'en' ? air.uvLabelEn : air.uvLabelEs}
                        </p>
                      </div>
                    </div>

                    {/* Métricas PM2.5, PM10 y Ozono */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-lana/10 bg-lana/[0.06] p-3 text-center">
                      <div>
                        <p className="font-mono text-[10px] text-lana/60">PM2.5</p>
                        <p className="mt-0.5 font-mono text-xs font-semibold text-lana">
                          {air.pm25.toFixed(1)}
                        </p>
                        <p className="text-[9px] text-lana/50">µg/m³</p>
                      </div>
                      <div className="border-x border-lana/10">
                        <p className="font-mono text-[10px] text-lana/60">PM10</p>
                        <p className="mt-0.5 font-mono text-xs font-semibold text-lana">
                          {air.pm10.toFixed(1)}
                        </p>
                        <p className="text-[9px] text-lana/50">µg/m³</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-lana/60">
                          {lang === 'en' ? 'Max UV' : 'UV máx.'}
                        </p>
                        <p className="mt-0.5 font-mono text-xs font-semibold text-trigo-soft">
                          {air.maxUv12h.toFixed(1)}
                        </p>
                        <p className="text-[9px] text-lana/50">12 h</p>
                      </div>
                    </div>

                    {/* Curva PM2.5 12h */}
                    {air.hourly.length >= 2 && (
                      <div className="mt-4 rounded-2xl border border-lana/10 bg-lana/[0.05] p-3.5">
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-lana/65">
                          {lang === 'en'
                            ? 'PM2.5 particle curve (next 12h)'
                            : 'Material particulado PM2.5 (próximas 12 h)'}
                        </p>
                        <MiniSparkline
                          points={air.hourly.map((h) => ({
                            label: h.hourLabel,
                            value: h.pm25,
                          }))}
                          strokeColor="#E3B45A"
                          fillColor="rgba(227, 180, 90, 0.16)"
                          unitSuffix=""
                          ariaLabel="Evolución de PM2.5 en Nobsa durante las próximas 12 horas"
                        />
                      </div>
                    )}
                  </>
                ) : null
              ) : holidaysLoading && !holidays ? (
                <div className="mt-5 space-y-3 animate-pulse">
                  <div className="h-11 rounded-xl bg-lana/10" />
                  <div className="h-11 rounded-xl bg-lana/10" />
                  <div className="h-11 rounded-xl bg-lana/10" />
                </div>
              ) : holidaysErr && !holidays ? (
                <div className="mt-5 rounded-2xl border border-lana/15 bg-lana/5 p-4 text-xs text-lana/80">
                  <p>{holidaysErr}</p>
                  <button
                    type="button"
                    onClick={() => void loadHolidays()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-trigo px-3 py-1.5 font-mono text-[11px] font-semibold text-tinta"
                  >
                    <RefreshCw className="h-3 w-3" /> {t.liveRefresh}
                  </button>
                </div>
              ) : holidays ? (
                <ul className="mt-4 divide-y divide-lana/10">
                  {holidays.holidays.map((h) => (
                    <li
                      key={`${h.date}-${h.localName}`}
                      className="flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] uppercase text-trigo-soft">
                            {h.formattedDate}
                          </span>
                          {h.isLongWeekend && (
                            <span className="rounded-full bg-trigo/20 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase text-trigo-soft">
                              Puente
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs font-medium text-lana sm:text-sm">
                          {h.localName}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-lana/15 bg-lana/5 px-2.5 py-1 font-mono text-[10px] text-lana/85">
                        {h.daysUntil === 0
                          ? '¡Hoy!'
                          : lang === 'en'
                          ? `In ${h.daysUntil}d`
                          : `En ${h.daysUntil} d`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-lana/15 pt-3 text-[11px] text-lana/65">
              <span>
                {thirdTab === 'air'
                  ? t.airFooter
                  : holidays?.sourceLabel || 'Calendario Festivos Colombia'}
              </span>
              <span className="font-mono">
                {thirdTab === 'air'
                  ? formatTimeShort(air?.fetchedAt ?? null)
                  : formatTimeShort(holidays?.fetchedAt ?? null)}
              </span>
            </div>
          </article>
        </div>

        {/* RECOMENDADOR INTELIGENTE «¿QUÉ PLAN CONVIENE HOY?» CONECTADO A OPEN-METEO */}
        {recommendation && (
          <div className="mt-8 rounded-3xl border border-tinta/15 bg-lana-soft p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-tinta/10 pb-5 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-grana/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-grana">
                  <Sparkles className="h-3.5 w-3.5" />
                  {recommendation.badge}
                </span>
                <h3 className="mt-2.5 font-display text-2xl font-semibold text-tinta sm:text-3xl">
                  {recommendation.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-muted">
                  {recommendation.advice}
                </p>
              </div>
              <Link
                to="/territorio"
                className="inline-flex min-h-[40px] shrink-0 items-center gap-2 self-start rounded-full border border-tinta/20 bg-lana px-4 py-2 text-xs font-semibold text-tinta transition hover:border-grana hover:text-grana lg:self-auto"
              >
                <Compass className="h-4 w-4 text-grana" />
                {lang === 'en' ? 'See all stops on map' : 'Ver todos los puntos en el mapa'}
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {recommendation.stops.map((rec, idx) => {
                const place = PLACES.find((p) => p.id === rec.placeId);
                if (!place) return null;
                const title =
                  lang === 'en' && PLACE_EN[place.id] ? PLACE_EN[place.id].name : place.name;
                return (
                  <div
                    key={place.id}
                    className="flex flex-col justify-between rounded-2xl border border-tinta/10 bg-lana p-4 sm:p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-grana">
                          0{idx + 1} · {place.highlightTag}
                        </span>
                      </div>
                      <Link
                        to={`/territorio?lugar=${place.id}`}
                        className="mt-1.5 block font-display text-lg font-semibold text-tinta hover:text-grana"
                      >
                        {title}
                      </Link>
                      <p className="mt-2 text-xs leading-relaxed text-tinta-muted">{rec.reason}</p>
                    </div>

                    <div className="mt-4 border-t border-tinta/10 pt-3">
                      {place.lat !== null && place.lon !== null ? (
                        <NavigationActions lat={place.lat} lon={place.lon} compact />
                      ) : (
                        <Link
                          to={`/territorio?lugar=${place.id}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-grana hover:underline"
                        >
                          {lang === 'en' ? 'View craft guide' : 'Ver ficha artesanal'}{' '}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
