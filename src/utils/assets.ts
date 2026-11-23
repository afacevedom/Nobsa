const REMOTE_FALLBACK_BASE = 'https://afacevedom.github.io/Nobsa/imagenes/';

export function getLocalImageUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}imagenes/${encodeURIComponent(filename)}`;
}

export function getRemoteFallbackImageUrl(filename: string): string {
  return `${REMOTE_FALLBACK_BASE}${encodeURIComponent(filename)}`;
}

export function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(4)}° ${latDir} · ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
