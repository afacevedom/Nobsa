import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, LocateFixed, Maximize2 } from 'lucide-react';
import { PLACE_CATEGORIES } from '../../data/places';
import type { Place } from '../../types/nobsa';
import { getGoogleMapsDirUrl, getOsmPlaceUrl, getWazeUrl, NOBSA_CENTER_COORDS } from '../../utils/navigation';
import { haversineKm } from '../../utils/gpx';
import { useLanguage } from '../../context/LanguageContext';

type BaseLayerId = 'osm' | 'topo' | 'sat';

const TILE_LAYERS: Record<
  BaseLayerId,
  { labelEs: string; labelEn: string; url: string; attribution: string; maxZoom: number }
> = {
  osm: {
    labelEs: 'OpenStreetMap',
    labelEn: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  topo: {
    labelEs: 'Relieve',
    labelEn: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, SRTM | Estilo: OpenTopoMap (CC-BY-SA)',
    maxZoom: 17,
  },
  sat: {
    labelEs: 'Satélite',
    labelEn: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imágenes &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
};

interface NobsaMapProps {
  places: Place[];
  selectedId: string;
  onSelect: (id: string) => void;
  routePlaces?: Place[];
  heightClass?: string;
}

const NOBSA_CENTER: [number, number] = [5.7745, -72.936];

export function NobsaMap({
  places,
  selectedId,
  onSelect,
  routePlaces = [],
  heightClass = 'h-[340px] sm:h-[450px] lg:h-[540px]',
}: NobsaMapProps) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [baseLayer, setBaseLayer] = useState<BaseLayerId>('osm');
  const [locating, setLocating] = useState(false);
  const [userDistanceKm, setUserDistanceKm] = useState<number | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Inicialización del mapa Leaflet
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: NOBSA_CENTER,
      zoom: 13,
      scrollWheelZoom: false,
    });

    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current.clear();
      routeLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // Cambio dinámico de capa base (OpenStreetMap / Relieve / Satélite)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const cfg = TILE_LAYERS[baseLayer];
    const layer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = layer;
  }, [baseLayer]);

  // Pines numerados con popups enriquecidos (Google Maps / Waze / OSM)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    places.forEach((place) => {
      if (place.lat === null || place.lon === null) return;
      const primaryCat = place.categories[0];
      const color = PLACE_CATEGORIES[primaryCat].color;
      const isActive = place.id === selectedId;

      const icon = L.divIcon({
        className: 'nobsa-marker-icon',
        html: `<div class="nobsa-pin ${isActive ? 'is-active' : ''}" style="background:${color}">${place.number}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const gmaps = getGoogleMapsDirUrl(place.lat, place.lon);
      const waze = getWazeUrl(place.lat, place.lon);
      const osm = getOsmPlaceUrl(place.lat, place.lon);

      const popupHtml = `
        <div style="min-width:190px;font-family:'Plus Jakarta Sans',sans-serif">
          <div style="font-weight:700;font-size:13px;color:#F5F1E8">${place.name}</div>
          <div style="font-size:11px;color:#E3B45A;margin-top:2px">${place.highlightTag}</div>
          <div style="display:flex;gap:8px;margin-top:8px;font-size:11px">
            <a href="${gmaps}" target="_blank" rel="noopener noreferrer" style="color:#F5F1E8;text-decoration:underline">Google Maps</a>
            <a href="${waze}" target="_blank" rel="noopener noreferrer" style="color:#E3B45A;text-decoration:underline">Waze</a>
            <a href="${osm}" target="_blank" rel="noopener noreferrer" style="color:#C9C5BC;text-decoration:underline">OSM</a>
          </div>
        </div>
      `;

      const marker = L.marker([place.lat, place.lon], { icon }).addTo(map).bindPopup(popupHtml);

      marker.on('click', () => {
        onSelect(place.id);
      });

      markersRef.current.set(place.id, marker);
    });
  }, [places, selectedId, onSelect]);

  // Trazado de ruta sobre el mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const validStops = routePlaces.filter((p) => p.lat !== null && p.lon !== null);
    if (validStops.length < 2) return;

    const latLngs: [number, number][] = validStops.map((p) => [
      p.lat as number,
      p.lon as number,
    ]);

    const layer = L.polyline(latLngs, {
      color: '#8F2429',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '7 7',
    }).addTo(map);

    routeLayerRef.current = layer;

    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
    }
  }, [routePlaces]);

  // Vuelo suave al lugar seleccionado
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routePlaces.length >= 2) return;
    const selected = places.find((p) => p.id === selectedId);
    if (selected && selected.lat !== null && selected.lon !== null) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      map.flyTo([selected.lat, selected.lon], 14, {
        animate: !reduced,
        duration: 0.75,
      });
    }
  }, [selectedId, places, routePlaces.length]);

  const handleFitAll = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const coords = places
      .filter((p) => p.lat !== null && p.lon !== null)
      .map((p) => [p.lat as number, p.lon as number] as [number, number]);
    if (coords.length === 0) {
      map.setView(NOBSA_CENTER, 13);
      return;
    }
    map.fitBounds(L.latLngBounds(coords), { padding: [32, 32], maxZoom: 14 });
  }, [places]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoMessage(
        lang === 'en'
          ? 'Geolocation is not supported in this browser.'
          : 'Tu navegador no soporta geolocalización.'
      );
      return;
    }
    setLocating(true);
    setGeoMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        const km = haversineKm(
          latitude,
          longitude,
          NOBSA_CENTER_COORDS.lat,
          NOBSA_CENTER_COORDS.lon
        );
        setUserDistanceKm(km);

        const map = mapRef.current;
        if (map) {
          if (userMarkerRef.current) userMarkerRef.current.remove();
          userMarkerRef.current = L.circleMarker([latitude, longitude], {
            radius: 7,
            color: '#FAF8F3',
            weight: 2.5,
            fillColor: '#263654',
            fillOpacity: 1,
          })
            .addTo(map)
            .bindPopup(lang === 'en' ? 'Your current location' : 'Tu ubicación actual');

          // Si el usuario está cerca de Nobsa (< 25 km), enfocar ambos; si está lejos, mostrar solo distancia
          if (km < 25) {
            map.fitBounds(
              L.latLngBounds([
                [latitude, longitude],
                [NOBSA_CENTER_COORDS.lat, NOBSA_CENTER_COORDS.lon],
              ]),
              { padding: [40, 40], maxZoom: 14 }
            );
          }
        }
      },
      () => {
        setLocating(false);
        setGeoMessage(
          lang === 'en'
            ? 'Location permission denied. You can still launch routes in Google Maps or Waze.'
            : 'No se pudo obtener tu ubicación. Igual puedes abrir la ruta directo en Google Maps o Waze.'
        );
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [lang]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-tinta/15 bg-lana-deep shadow-editorial">
      {/* Barra superior de control cartográfico OpenStreetMap */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-tinta/10 bg-lana-soft px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Capa del mapa">
          <span className="mr-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-tinta-soft">
            <Layers className="h-3.5 w-3.5 text-grana" />
            {lang === 'en' ? 'Layer:' : 'Capa:'}
          </span>
          {(Object.keys(TILE_LAYERS) as BaseLayerId[]).map((id) => {
            const active = baseLayer === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setBaseLayer(id)}
                aria-pressed={active}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition ${
                  active
                    ? 'bg-tinta font-semibold text-lana'
                    : 'border border-tinta/15 bg-lana text-tinta-muted hover:text-tinta'
                }`}
              >
                {lang === 'en' ? TILE_LAYERS[id].labelEn : TILE_LAYERS[id].labelEs}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleFitAll}
            className="inline-flex items-center gap-1 rounded-full border border-tinta/15 bg-lana px-2.5 py-1 font-mono text-[11px] text-tinta transition hover:border-grana hover:text-grana"
            title={lang === 'en' ? 'Center on all Nobsa landmarks' : 'Ver todos los puntos de Nobsa'}
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Fit all' : 'Ver todo'}</span>
          </button>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="inline-flex items-center gap-1 rounded-full border border-tinta/15 bg-lana px-2.5 py-1 font-mono text-[11px] text-tinta transition hover:border-grana hover:text-grana disabled:opacity-50"
            title={lang === 'en' ? 'Calculate distance from my location' : 'Calcular distancia desde mi ubicación'}
          >
            <LocateFixed className={`h-3 w-3 ${locating ? 'animate-pulse text-grana' : ''}`} />
            <span className="hidden sm:inline">{lang === 'en' ? 'My distance' : 'Mi ubicación'}</span>
          </button>
        </div>
      </div>

      {/* Contenedor Leaflet */}
      <div
        ref={containerRef}
        className={`w-full ${heightClass}`}
        role="region"
        aria-label="Mapa interactivo OpenStreetMap de lugares verificados en Nobsa, Boyacá"
      />

      {/* Pie informativo del mapa */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-tinta/10 bg-lana-soft px-4 py-2.5 text-xs text-tinta-muted">
        <span>
          {geoMessage ? (
            geoMessage
          ) : userDistanceKm !== null ? (
            <>
              {lang === 'en' ? 'Straight-line distance to Nobsa:' : 'Distancia en línea recta a Nobsa:'}{' '}
              <strong className="font-mono text-grana">{userDistanceKm.toFixed(1)} km</strong>
            </>
          ) : routePlaces.length >= 2 ? (
            lang === 'en'
              ? 'Dashed line: reference path connecting verified GPS waypoints.'
              : 'Línea punteada: trazado referencial entre puntos GPS verificados.'
          ) : lang === 'en' ? (
            'Click any numbered pin to inspect the landmark or open directions.'
          ) : (
            'Toca un pin numerado para abrir su ficha o iniciar navegación en Google Maps / Waze.'
          )}
        </span>
        <span className="font-mono text-[11px]">OpenStreetMap · Leaflet</span>
      </div>
    </div>
  );
}
