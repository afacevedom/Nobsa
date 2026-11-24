import { ExternalLink, Navigation } from 'lucide-react';
import { getGoogleMapsDirUrl, getOsmPlaceUrl, getWazeUrl } from '../../utils/navigation';
import { useLanguage } from '../../context/LanguageContext';

interface NavigationActionsProps {
  lat: number | null;
  lon: number | null;
  origin?: string;
  compact?: boolean;
}

export function NavigationActions({
  lat,
  lon,
  origin,
  compact = false,
}: NavigationActionsProps) {
  const { lang } = useLanguage();

  if (lat === null || lon === null) return null;

  const baseCls = compact
    ? 'inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition'
    : 'inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={getGoogleMapsDirUrl(lat, lon, origin)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseCls} bg-tinta text-lana hover:bg-grana`}
      >
        <Navigation className="h-3.5 w-3.5" />
        Google Maps
      </a>

      <a
        href={getWazeUrl(lat, lon)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseCls} border border-indigo-telar/30 bg-indigo-telar/10 text-indigo-telar hover:bg-indigo-telar hover:text-lana`}
      >
        <Navigation className="h-3.5 w-3.5" />
        Waze
      </a>

      <a
        href={getOsmPlaceUrl(lat, lon)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseCls} border border-tinta/15 bg-lana text-tinta hover:border-tinta`}
      >
        {lang === 'en' ? 'OpenStreetMap' : 'Ver en OSM'}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
