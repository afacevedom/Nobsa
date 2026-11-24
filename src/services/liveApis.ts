export interface WeatherForecastDay {
  date: string;
  label: string;
  tempMax: number;
  tempMin: number;
  precipProb: number;
}

export interface HourlyTempPoint {
  hourLabel: string;
  temperature: number;
  precipProb: number;
}

export interface NobsaWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  conditionLabel: string;
  conditionLabelEn: string;
  conditionKind: 'sun' | 'cloud-sun' | 'cloud' | 'fog' | 'rain' | 'storm';
  isDay: boolean;
  forecast: WeatherForecastDay[];
  hourly: HourlyTempPoint[];
  fetchedAt: Date;
  fromCache?: boolean;
  source: string;
}

export interface DollarHistoryPoint {
  date: string;
  rateCop: number;
}

export interface DollarRateData {
  rateCop: number;
  previousRateCop: number | null;
  changeCop: number | null;
  changePct: number | null;
  effectiveDate: string;
  history: DollarHistoryPoint[];
  sourceLabel: string;
  sourceUrl: string;
  fetchedAt: Date;
  fromCache?: boolean;
}

export interface HourlyAirPoint {
  hourLabel: string;
  pm25: number;
  uvIndex: number;
}

export interface NobsaAirQualityData {
  usAqi: number;
  aqiLabelEs: string;
  aqiLabelEn: string;
  aqiLevel: 'good' | 'moderate' | 'sensitive' | 'unhealthy';
  pm25: number;
  pm10: number;
  ozone: number;
  uvIndex: number;
  uvLabelEs: string;
  uvLabelEn: string;
  maxUv12h: number;
  hourly: HourlyAirPoint[];
  fetchedAt: Date;
  fromCache?: boolean;
  source: string;
}

export interface ColombiaHolidayItem {
  date: string;
  formattedDate: string;
  weekdayLabel: string;
  localName: string;
  daysUntil: number;
  isLongWeekend: boolean;
}

export interface ColombiaHolidaysData {
  holidays: ColombiaHolidayItem[];
  sourceLabel: string;
  fetchedAt: Date;
  fromCache?: boolean;
}

const NOBSA_LAT = 5.7706;
const NOBSA_LON = -72.9398;

const CACHE_WEATHER = 'nobsa-cache-weather-v3';
const CACHE_DOLLAR = 'nobsa-cache-dollar-v3';
const CACHE_AIR = 'nobsa-cache-air-v3';
const CACHE_HOLIDAYS = 'nobsa-cache-holidays-co-v3';

function saveCache<T>(key: string, payload: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignorar errores de cuota
  }
}

function readCache<T extends { fetchedAt: Date | string }>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    return { ...parsed, fetchedAt: new Date(parsed.fetchedAt), fromCache: true };
  } catch {
    return null;
  }
}

function describeWmoCode(code: number): {
  label: string;
  labelEn: string;
  kind: NobsaWeatherData['conditionKind'];
} {
  if (code === 0) return { label: 'Cielo despejado', labelEn: 'Clear sky', kind: 'sun' };
  if (code === 1 || code === 2)
    return { label: 'Parcialmente nublado', labelEn: 'Partly cloudy', kind: 'cloud-sun' };
  if (code === 3) return { label: 'Nublado', labelEn: 'Overcast', kind: 'cloud' };
  if (code === 45 || code === 48)
    return { label: 'Neblina en el valle', labelEn: 'Valley fog', kind: 'fog' };
  if ([51, 53, 55, 56, 57].includes(code))
    return { label: 'Llovizna ligera', labelEn: 'Light drizzle', kind: 'rain' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { label: 'Lluvias en la zona', labelEn: 'Rain showers', kind: 'rain' };
  if ([95, 96, 99].includes(code))
    return { label: 'Tormenta eléctrica', labelEn: 'Thunderstorm', kind: 'storm' };
  return { label: 'Condición variable', labelEn: 'Variable skies', kind: 'cloud-sun' };
}

function describeUsAqi(aqi: number): {
  labelEs: string;
  labelEn: string;
  level: NobsaAirQualityData['aqiLevel'];
} {
  if (aqi <= 50) return { labelEs: 'Buena', labelEn: 'Good', level: 'good' };
  if (aqi <= 100) return { labelEs: 'Moderada', labelEn: 'Moderate', level: 'moderate' };
  if (aqi <= 150) return { labelEs: 'Sensible', labelEn: 'Sensitive', level: 'sensitive' };
  return { labelEs: 'Elevada', labelEn: 'Unhealthy', level: 'unhealthy' };
}

function describeUv(uv: number): { labelEs: string; labelEn: string } {
  if (uv < 3) return { labelEs: 'Bajo', labelEn: 'Low' };
  if (uv < 6) return { labelEs: 'Moderado', labelEn: 'Moderate' };
  if (uv < 8) return { labelEs: 'Alto', labelEn: 'High' };
  if (uv < 11) return { labelEs: 'Muy alto', labelEn: 'Very high' };
  return { labelEs: 'Extremo', labelEn: 'Extreme' };
}

function formatShortDay(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3) return isoDate;
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(id);
  }
}

export function getCachedWeather(): NobsaWeatherData | null {
  return readCache<NobsaWeatherData>(CACHE_WEATHER);
}

export function getCachedDollar(): DollarRateData | null {
  return readCache<DollarRateData>(CACHE_DOLLAR);
}

export function getCachedAirQuality(): NobsaAirQualityData | null {
  return readCache<NobsaAirQualityData>(CACHE_AIR);
}

export function getCachedHolidays(): ColombiaHolidaysData | null {
  return readCache<ColombiaHolidaysData>(CACHE_HOLIDAYS);
}

// 1) OPEN-METEO WEATHER: Clima actual + curva 12 horas + pronóstico 3 días
export async function fetchNobsaWeather(): Promise<NobsaWeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${NOBSA_LAT}&longitude=${NOBSA_LON}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
    `&hourly=temperature_2m,precipitation_probability&forecast_hours=12` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=America%2FBogota&forecast_days=3`;

  const res = await fetchWithTimeout(url, 9000);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const data = await res.json();

  const cur = data.current;
  const wmo = describeWmoCode(Number(cur.weather_code ?? 0));
  const daily = data.daily || {};
  const dates: string[] = daily.time || [];

  const forecast: WeatherForecastDay[] = dates.slice(0, 3).map((d: string, i: number) => ({
    date: d,
    label: i === 0 ? 'Hoy' : formatShortDay(d),
    tempMax: Math.round(Number(daily.temperature_2m_max?.[i] ?? 0)),
    tempMin: Math.round(Number(daily.temperature_2m_min?.[i] ?? 0)),
    precipProb: Math.round(Number(daily.precipitation_probability_max?.[i] ?? 0)),
  }));

  const hourlyTimes: string[] = data.hourly?.time || [];
  const hourly: HourlyTempPoint[] = hourlyTimes.slice(0, 12).map((t: string, i: number) => ({
    hourLabel: t.slice(11, 16),
    temperature: Number(data.hourly?.temperature_2m?.[i] ?? cur.temperature_2m),
    precipProb: Math.round(Number(data.hourly?.precipitation_probability?.[i] ?? 0)),
  }));

  const result: NobsaWeatherData = {
    temperature: Number(cur.temperature_2m),
    apparentTemperature: Number(cur.apparent_temperature),
    humidity: Math.round(Number(cur.relative_humidity_2m)),
    windSpeed: Math.round(Number(cur.wind_speed_10m)),
    weatherCode: Number(cur.weather_code),
    conditionLabel: wmo.label,
    conditionLabelEn: wmo.labelEn,
    conditionKind: wmo.kind,
    isDay: cur.is_day === 1,
    forecast,
    hourly,
    fetchedAt: new Date(),
    fromCache: false,
    source: 'Open-Meteo',
  };

  saveCache(CACHE_WEATHER, result);
  return result;
}

// 2) PRECIO DEL DÓLAR EN COLOMBIA + Serie 7 días (TRM oficial Datos Abiertos Colombia)
export async function fetchDollarCop(): Promise<DollarRateData> {
  try {
    const trmUrl =
      'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=7';
    const res = await fetchWithTimeout(trmUrl, 8000);
    if (res.ok) {
      const rows = (await res.json()) as Array<{
        valor?: string;
        vigenciadesde?: string;
      }>;
      if (Array.isArray(rows) && rows.length > 0 && rows[0].valor) {
        const current = parseFloat(rows[0].valor);
        const prev = rows[1]?.valor ? parseFloat(rows[1].valor) : null;
        if (!Number.isNaN(current) && current > 0) {
          const changeCop = prev !== null && !Number.isNaN(prev) ? current - prev : null;
          const changePct = changeCop !== null && prev ? (changeCop / prev) * 100 : null;
          const rawDate = (rows[0].vigenciadesde || '').slice(0, 10);
          const history: DollarHistoryPoint[] = rows
            .filter((r) => r.valor && !Number.isNaN(parseFloat(r.valor)))
            .map((r) => ({
              date: (r.vigenciadesde || '').slice(5, 10),
              rateCop: parseFloat(r.valor as string),
            }))
            .reverse();

          const result: DollarRateData = {
            rateCop: current,
            previousRateCop: prev,
            changeCop,
            changePct,
            effectiveDate: rawDate || 'Vigente hoy',
            history,
            sourceLabel: 'TRM Oficial · Datos Abiertos Colombia',
            sourceUrl:
              'https://www.datos.gov.co/Econom-a-y-Finanzas/Tasa-de-Cambio-Representativa-del-Mercado-TRM/32sa-8pi3',
            fetchedAt: new Date(),
            fromCache: false,
          };
          saveCache(CACHE_DOLLAR, result);
          return result;
        }
      }
    }
  } catch {
    // Respaldo 1
  }

  try {
    const res = await fetchWithTimeout('https://co.dolarapi.com/v1/trm', 7000);
    if (res.ok) {
      const data = (await res.json()) as {
        valor?: number;
        vigenciaDesde?: string;
        fechaActualizacion?: string;
      };
      if (typeof data.valor === 'number' && data.valor > 0) {
        const result: DollarRateData = {
          rateCop: data.valor,
          previousRateCop: null,
          changeCop: null,
          changePct: null,
          effectiveDate:
            (data.vigenciaDesde || data.fechaActualizacion || '').slice(0, 10) || 'Vigente hoy',
          history: [],
          sourceLabel: 'TRM Colombia · DolarApi',
          sourceUrl: 'https://dolarapi.com/docs/colombia/',
          fetchedAt: new Date(),
          fromCache: false,
        };
        saveCache(CACHE_DOLLAR, result);
        return result;
      }
    }
  } catch {
    // Respaldo 2
  }

  const res = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 8000);
  if (!res.ok) throw new Error(`USD/COP HTTP ${res.status}`);
  const data = (await res.json()) as {
    rates?: Record<string, number>;
    time_last_update_utc?: string;
  };
  const cop = data.rates?.COP;
  if (!cop || Number.isNaN(cop)) throw new Error('Sin tasa COP disponible');

  const result: DollarRateData = {
    rateCop: cop,
    previousRateCop: null,
    changeCop: null,
    changePct: null,
    effectiveDate: data.time_last_update_utc ? data.time_last_update_utc.slice(0, 16) : 'Hoy',
    history: [],
    sourceLabel: 'Mercado USD/COP · Open ER-API',
    sourceUrl: 'https://www.exchangerate-api.com/',
    fetchedAt: new Date(),
    fromCache: false,
  };
  saveCache(CACHE_DOLLAR, result);
  return result;
}

// 3) OPEN-METEO AIR QUALITY & UV: Calidad del aire, PM2.5, PM10, Ozono e Índice UV en Nobsa
//    CORS nativo abierto, sin API key, sin proxies intermedios.
export async function fetchNobsaAirQuality(): Promise<NobsaAirQualityData> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${NOBSA_LAT}&longitude=${NOBSA_LON}` +
    `&current=us_aqi,pm10,pm2_5,ozone,uv_index` +
    `&hourly=pm2_5,uv_index&forecast_hours=12` +
    `&timezone=America%2FBogota`;

  const res = await fetchWithTimeout(url, 9000);
  if (!res.ok) throw new Error(`Open-Meteo Air Quality HTTP ${res.status}`);
  const data = await res.json();

  const cur = data.current || {};
  const usAqi = Math.round(Number(cur.us_aqi ?? 0));
  const pm25 = Number(cur.pm2_5 ?? 0);
  const pm10 = Number(cur.pm10 ?? 0);
  const ozone = Number(cur.ozone ?? 0);
  const uvIndex = Number(cur.uv_index ?? 0);

  const aqiInfo = describeUsAqi(usAqi);
  const uvInfo = describeUv(uvIndex);

  const hourlyTimes: string[] = data.hourly?.time || [];
  const hourly: HourlyAirPoint[] = hourlyTimes.slice(0, 12).map((t: string, i: number) => ({
    hourLabel: t.slice(11, 16),
    pm25: Number(data.hourly?.pm2_5?.[i] ?? pm25),
    uvIndex: Number(data.hourly?.uv_index?.[i] ?? 0),
  }));

  const maxUv12h = hourly.reduce((acc, h) => Math.max(acc, h.uvIndex), uvIndex);

  const result: NobsaAirQualityData = {
    usAqi,
    aqiLabelEs: aqiInfo.labelEs,
    aqiLabelEn: aqiInfo.labelEn,
    aqiLevel: aqiInfo.level,
    pm25,
    pm10,
    ozone,
    uvIndex,
    uvLabelEs: uvInfo.labelEs,
    uvLabelEn: uvInfo.labelEn,
    maxUv12h,
    hourly,
    fetchedAt: new Date(),
    fromCache: false,
    source: 'Open-Meteo Air Quality',
  };

  saveCache(CACHE_AIR, result);
  return result;
}

// 4) PRÓXIMOS FESTIVOS Y PUENTES EN COLOMBIA (Nager.Date v3 -> respaldo API-Colombia)
function formatHolidayRow(isoDate: string, localName: string): ColombiaHolidayItem | null {
  const clean = isoDate.slice(0, 10);
  const parts = clean.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const targetUtc = Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const daysUntil = Math.round((targetUtc - todayUtc) / 86_400_000);
  if (daysUntil < 0) return null;

  const targetDate = new Date(targetUtc);
  const weekdayNum = targetDate.getUTCDay(); // 1 = Lunes (Puente festivo en Colombia)

  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(targetDate);

  const weekdayLabel = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(targetDate);

  return {
    date: clean,
    formattedDate,
    weekdayLabel,
    localName: localName.trim(),
    daysUntil,
    isLongWeekend: weekdayNum === 1,
  };
}

export async function fetchColombiaHolidays(): Promise<ColombiaHolidaysData> {
  // Primaria: Nager.Date API v3 (CORS abierto, sin API key)
  try {
    const res = await fetchWithTimeout('https://date.nager.at/api/v3/NextPublicHolidays/CO', 8000);
    if (res.ok) {
      const rows = (await res.json()) as Array<{ date?: string; localName?: string; name?: string }>;
      if (Array.isArray(rows)) {
        const holidays = rows
          .map((r) => formatHolidayRow(r.date || '', r.localName || r.name || ''))
          .filter((item): item is ColombiaHolidayItem => Boolean(item))
          .slice(0, 5);
        if (holidays.length > 0) {
          const result: ColombiaHolidaysData = {
            holidays,
            sourceLabel: 'Nager.Date · Calendario CO',
            fetchedAt: new Date(),
            fromCache: false,
          };
          saveCache(CACHE_HOLIDAYS, result);
          return result;
        }
      }
    }
  } catch {
    // Continuar con respaldo API-Colombia
  }

  // Respaldo: API-Colombia (año actual y siguiente)
  const year = new Date().getFullYear();
  const [resCur, resNext] = await Promise.all([
    fetchWithTimeout(`https://api-colombia.com/api/v1/Holiday/year/${year}`, 8000),
    fetchWithTimeout(`https://api-colombia.com/api/v1/Holiday/year/${year + 1}`, 8000).catch(() => null),
  ]);

  const rawList: Array<{ date?: string; name?: string }> = [];
  if (resCur.ok) {
    const a = (await resCur.json()) as Array<{ date?: string; name?: string }>;
    if (Array.isArray(a)) rawList.push(...a);
  }
  if (resNext && resNext.ok) {
    const b = (await resNext.json()) as Array<{ date?: string; name?: string }>;
    if (Array.isArray(b)) rawList.push(...b);
  }

  const holidays = rawList
    .map((r) => formatHolidayRow(r.date || '', r.name || ''))
    .filter((item): item is ColombiaHolidayItem => Boolean(item))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  if (holidays.length === 0) {
    throw new Error('No se pudieron cargar los próximos festivos de Colombia');
  }

  const result: ColombiaHolidaysData = {
    holidays,
    sourceLabel: 'API-Colombia · Festivos CO',
    fetchedAt: new Date(),
    fromCache: false,
  };
  saveCache(CACHE_HOLIDAYS, result);
  return result;
}
