import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PLACE_CATEGORIES } from '../../data/places';
import type { Place } from '../../types/nobsa';

interface NobsaMapProps {
  places: Place[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const NOBSA_CENTER: [number, number] = [5.7745, -72.936];

export function NobsaMap({ places, selectedId, onSelect }: NobsaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: NOBSA_CENTER,
      zoom: 13,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

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

      const marker = L.marker([place.lat, place.lon], { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${place.name}</strong><br/><span style="opacity:.8;font-size:12px">${place.highlightTag}</span>`
        );

      marker.on('click', () => {
        onSelect(place.id);
      });

      markersRef.current.set(place.id, marker);
    });
  }, [places, selectedId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const selected = places.find((p) => p.id === selectedId);
    if (selected && selected.lat !== null && selected.lon !== null) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      map.flyTo([selected.lat, selected.lon], 14, {
        animate: !reduced,
        duration: 0.75,
      });
    }
  }, [selectedId, places]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-tinta/15 bg-lana-deep shadow-editorial">
      <div
        ref={containerRef}
        className="h-[300px] w-full sm:h-[420px] lg:h-[520px]"
        role="region"
        aria-label="Mapa interactivo de lugares verificados en Nobsa, Boyacá"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-tinta/10 bg-lana-soft px-4 py-2.5 text-xs text-tinta-muted">
        <span>Toca cada pin numerado para ver el dossier completo del lugar.</span>
        <span className="font-mono text-[11px]">OSM · Alto Chicamocha</span>
      </div>
    </div>
  );
}
