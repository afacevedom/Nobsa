export interface WeatherForecastDay {
  date: string;
  label: string;
  tempMax: number;
  tempMin: number;
  precipProb: number;
}

export interface NobsaWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  conditionLabel: string;
  conditionKind: 'sun' | 'cloud-sun' | 'cloud' | 'fog' | 'rain' | 'storm';
  isDay: boolean;
  forecast: WeatherForecastDay[];
  fetchedAt: Date;
  source: string;
}

export interface DollarRateData {
  rateCop: number;
  previousRateCop: number | null;
  changeCop: number | null;
  changePct: number | null;
  effectiveDate: string;
  sourceLabel: string;
  sourceUrl: string;
  fetchedAt: Date;
}

export interface GdeltArticle {
  url: string;
  title: string;
  domain: string;
  seenDateRaw: string;
  seenDateFormatted: string;
  language: string;
  socialImage: string | null;
}

export interface GdeltNewsData {
  articles: GdeltArticle[];
  scope: 'nobsa' | 'boyaca';
  fetchedAt: Date;
}

const NOBSA_LAT = 5.7706;
const NOBSA_LON = -72.9398;

function describeWmoCode(code: number): {
  label: string;
  kind: NobsaWeatherData['conditionKind'];
} {
  if (code === 0) return { label: 'Cielo despejado', kind: 'sun' };
  if (code === 1 || code === 2) return { label: 'Parcialmente nublado', kind: 'cloud-sun' };
  if (code === 3) return { label: 'Nublado', kind: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Neblina en el valle', kind: 'fog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Llovizna ligera', kind: 'rain' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Lluvias en la zona', kind: 'rain' };
  if ([95, 96, 99].includes(code)) return { label: 'Tormenta eléctrica', kind: 'storm' };
  return { label: 'Condición variable', kind: 'cloud-sun' };
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
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    window.clearTimeout(id);
  }
}

// 1) OPEN-METEO: Clima en vivo para Nobsa, Boyacá (sin API key, CORS abierto)
export async function fetchNobsaWeather(): Promise<NobsaWeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${NOBSA_LAT}&longitude=${NOBSA_LON}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
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

  return {
    temperature: Number(cur.temperature_2m),
    apparentTemperature: Number(cur.apparent_temperature),
    humidity: Math.round(Number(cur.relative_humidity_2m)),
    windSpeed: Math.round(Number(cur.wind_speed_10m)),
    weatherCode: Number(cur.weather_code),
    conditionLabel: wmo.label,
    conditionKind: wmo.kind,
    isDay: cur.is_day === 1,
    forecast,
    fetchedAt: new Date(),
    source: 'Open-Meteo',
  };
}

// 2) PRECIO DEL DÓLAR EN COLOMBIA (USD -> COP)
// Primaria: Datos Abiertos Colombia (TRM oficial Superfinanciera)
// Respaldo 1: DolarApi Colombia | Respaldo 2: Open ExchangeRate-API
export async function fetchDollarCop(): Promise<DollarRateData> {
  // Intento 1: Datos Abiertos Colombia (TRM oficial + día anterior para variación real)
  try {
    const trmUrl =
      'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=2';
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
          const changePct =
            changeCop !== null && prev ? (changeCop / prev) * 100 : null;
          const rawDate = (rows[0].vigenciadesde || '').slice(0, 10);
          return {
            rateCop: current,
            previousRateCop: prev,
            changeCop,
            changePct,
            effectiveDate: rawDate || 'Vigente hoy',
            sourceLabel: 'TRM Oficial · Datos Abiertos Colombia',
            sourceUrl: 'https://www.datos.gov.co/Econom-a-y-Finanzas/Tasa-de-Cambio-Representativa-del-Mercado-TRM/32sa-8pi3',
            fetchedAt: new Date(),
          };
        }
      }
    }
  } catch {
    // Continuar con respaldo 1
  }

  // Intento 2: DolarApi Colombia
  try {
    const res = await fetchWithTimeout('https://co.dolarapi.com/v1/trm', 7000);
    if (res.ok) {
      const data = (await res.json()) as {
        valor?: number;
        vigenciaDesde?: string;
        fechaActualizacion?: string;
      };
      if (typeof data.valor === 'number' && data.valor > 0) {
        return {
          rateCop: data.valor,
          previousRateCop: null,
          changeCop: null,
          changePct: null,
          effectiveDate: (data.vigenciaDesde || data.fechaActualizacion || '').slice(0, 10) || 'Vigente hoy',
          sourceLabel: 'TRM Colombia · DolarApi',
          sourceUrl: 'https://dolarapi.com/docs/colombia/',
          fetchedAt: new Date(),
        };
      }
    }
  } catch {
    // Continuar con respaldo 2
  }

  // Intento 3: Open ExchangeRate-API (spot USD/COP)
  const res = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 8000);
  if (!res.ok) throw new Error(`USD/COP HTTP ${res.status}`);
  const data = (await res.json()) as {
    rates?: Record<string, number>;
    time_last_update_utc?: string;
  };
  const cop = data.rates?.COP;
  if (!cop || Number.isNaN(cop)) throw new Error('Sin tasa COP disponible');

  return {
    rateCop: cop,
    previousRateCop: null,
    changeCop: null,
    changePct: null,
    effectiveDate: data.time_last_update_utc ? data.time_last_update_utc.slice(0, 16) : 'Hoy',
    sourceLabel: 'Mercado USD/COP · Open ER-API',
    sourceUrl: 'https://www.exchangerate-api.com/',
    fetchedAt: new Date(),
  };
}

// 3) GDELT DOC 2.0 API: Monitoreo de noticias recientes sobre Nobsa y Boyacá
function parseGdeltDate(seenDate: string): string {
  // Formato típico GDELT: "20261120T143000Z"
  const m = seenDate.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) return seenDate;
  const date = new Date(
    Date.UTC(
      Number(m[1]),
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4]),
      Number(m[5]),
      Number(m[6])
    )
  );
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin >= 0 && diffMin < 60) return `Hace ${Math.max(1, diffMin)} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours >= 1 && diffHours < 24) return `Hace ${diffHours} h`;
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export async function fetchGdeltNews(scope: 'nobsa' | 'boyaca' = 'nobsa'): Promise<GdeltNewsData> {
  const query =
    scope === 'nobsa'
      ? '("Nobsa" OR "Puntalarga" OR "Sugamuxi")'
      : '("Boyaca" Colombia OR "Sogamoso" OR "Duitama")';
  const timespan = scope === 'nobsa' ? '3m' : '14d';

  const url =
    `https://api.gdeltproject.org/api/v2/doc/doc` +
    `?query=${encodeURIComponent(query)}` +
    `&mode=artlist&maxrecords=8&format=json&sort=datedesc&timespan=${timespan}`;

  const res = await fetchWithTimeout(url, 12000);
  if (!res.ok) throw new Error(`GDELT HTTP ${res.status}`);

  const text = await res.text();
  if (!text.trim().startsWith('{')) {
    throw new Error('GDELT devolvió una respuesta no JSON (posible saturación temporal)');
  }

  const data = JSON.parse(text) as {
    articles?: Array<{
      url?: string;
      title?: string;
      domain?: string;
      seendate?: string;
      language?: string;
      socialimage?: string;
    }>;
  };

  const seenUrls = new Set<string>();
  const articles: GdeltArticle[] = (data.articles || [])
    .filter((a) => {
      if (!a.url || !a.title) return false;
      if (seenUrls.has(a.url)) return false;
      seenUrls.add(a.url);
      return true;
    })
    .slice(0, 6)
    .map((a) => ({
      url: a.url as string,
      title: (a.title as string).trim(),
      domain: a.domain || 'Medio externo',
      seenDateRaw: a.seendate || '',
      seenDateFormatted: a.seendate ? parseGdeltDate(a.seendate) : 'Reciente',
      language: a.language || 'Spanish',
      socialImage: a.socialimage || null,
    }));

  // Si la búsqueda específica de Nobsa no arroja resultados en esta ventana, cae automáticamente a Boyacá
  if (scope === 'nobsa' && articles.length === 0) {
    return fetchGdeltNews('boyaca');
  }

  return {
    articles,
    scope,
    fetchedAt: new Date(),
  };
}
