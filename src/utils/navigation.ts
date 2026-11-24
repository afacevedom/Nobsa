export const NOBSA_CENTER_COORDS = {
  lat: 5.77055,
  lon: -72.93977,
  label: 'Parque Principal de Nobsa, Boyacá',
};

export function getGoogleMapsDirUrl(lat: number, lon: number, origin?: string): string {
  const params = new URLSearchParams({
    api: '1',
    destination: `${lat},${lon}`,
  });
  if (origin && origin.trim()) {
    params.set('origin', origin.trim());
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function getWazeUrl(lat: number, lon: number): string {
  return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}

export function getOsmPlaceUrl(lat: number, lon: number, zoom = 16): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}
