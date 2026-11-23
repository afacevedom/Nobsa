import { useState } from 'react';
import { getLocalImageUrl, getRemoteFallbackImageUrl } from '../../utils/assets';

interface EditorialImageProps {
  filename: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  caption?: string;
}

export function EditorialImage({
  filename,
  alt,
  className = '',
  priority = false,
  caption,
}: EditorialImageProps) {
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

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      className={className}
    />
  );
}
