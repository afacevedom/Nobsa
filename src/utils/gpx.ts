import type { Place } from '../types/nobsa';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia aproximada en línea recta (km) entre dos coordenadas usando Haversine */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function totalRouteDistanceKm(places: Place[]): number {
  const valid = places.filter((p) => p.lat !== null && p.lon !== null);
  let total = 0;
  for (let i = 1; i < valid.length; i += 1) {
    total += haversineKm(
      valid[i - 1].lat as number,
      valid[i - 1].lon as number,
      valid[i].lat as number,
      valid[i].lon as number
    );
  }
  return total;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildGpxDocument(routeName: string, places: Place[]): string {
  const waypoints = places.filter((p) => p.lat !== null && p.lon !== null);
  const timestamp = new Date().toISOString();

  const wptXml = waypoints
    .map(
      (p) => `  <wpt lat="${p.lat}" lon="${p.lon}">
    <name>${escapeXml(p.name)}</name>
    <desc>${escapeXml(p.summary)}</desc>
  </wpt>`
    )
    .join('\n');

  const rteptXml = waypoints
    .map(
      (p) => `    <rtept lat="${p.lat}" lon="${p.lon}">
      <name>${escapeXml(p.name)}</name>
    </rtept>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Nobsa Boyaca Editorial" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(routeName)}</name>
    <desc>Puntos georreferenciados verificados en Nobsa, Boyacá, Colombia (OpenStreetMap / Wikiloc).</desc>
    <time>${timestamp}</time>
  </metadata>
${wptXml}
  <rte>
    <name>${escapeXml(routeName)}</name>
${rteptXml}
  </rte>
</gpx>
`;
}

export function downloadGpxFile(filename: string, routeName: string, places: Place[]): void {
  const gpx = buildGpxDocument(routeName, places);
  const blob = new Blob([gpx], { type: 'application/gpx+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.gpx') ? filename : `${filename}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
