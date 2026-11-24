import { useState } from 'react';
import { Expand } from 'lucide-react';
import { getLocalImageUrl, getRemoteFallbackImageUrl } from '../../utils/assets';
import { useLightbox } from '../../context/LightboxContext';
import { useLanguage } from '../../context/LanguageContext';

interface EditorialImageProps {
  filename: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  caption?: string;
  credit?: string;
  zoomable?: boolean;
}

export function EditorialImage({
  filename,
  alt,
  className = '',
  priority = false,
  caption,
  credit,
  zoomable = false,
}: EditorialImageProps) {
  const { openLightbox } = useLightbox();
  const { t } = useLanguage();
  const [stage, setStage] = useState<'local' | 'remote' | 'fallback'>(
    filename ? 'local' : 'fallback'
  );

  const src =
    filename && stage === 'local'
      ? getLocalImageUrl(filename)
      : filename && stage === 'remote'
      ? getRemoteFallbackImageUrl(filename)
      : null;

  const handleError = () => {
    if (stage === 'local') {
      setStage('remote');
    } else {
      setStage('fallback');
    }
  };

  if (!src || stage === 'fallback') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col justify-between overflow-hidden bg-tinta p-6 text-lana bg-loom-grid ${className}`}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-lana/60">
          <span>Nobsa · Alto Chicamocha</span>
          <span>Recurso visual</span>
        </div>
        <div className="my-auto py-8">
          <p className="font-display text-2xl italic text-lana/90">{caption || alt}</p>
          {filename && (
            <p className="mt-2 font-mono text-xs text-trigo-soft">
              Archivo esperado: public/imagenes/{filename}
            </p>
          )}
        </div>
        <div className="grid h-1.5 w-24 grid-cols-4 gap-1" aria-hidden="true">
          <span className="bg-grana" />
          <span className="bg-trigo" />
          <span className="bg-musgo" />
          <span className="bg-indigo-telar" />
        </div>
      </div>
    );
  }

  const imgEl = (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      className={className}
    />
  );

  if (!zoomable || !filename) {
    return imgEl;
  }

  return (
    <div className="group/zoom relative h-full w-full">
      {imgEl}
      <button
        type="button"
        onClick={() => openLightbox({ filename, alt, caption: caption || alt, credit })}
        aria-label={`${t.zoomHint}: ${alt}`}
        className="no-print absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-lana/25 bg-tinta/70 text-lana opacity-90 backdrop-blur-sm transition hover:bg-grana sm:opacity-0 sm:group-hover/zoom:opacity-100 sm:focus:opacity-100"
      >
        <Expand className="h-4 w-4" />
      </button>
    </div>
  );
}
