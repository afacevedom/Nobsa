import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useLightbox } from '../../context/LightboxContext';
import { getLocalImageUrl, getRemoteFallbackImageUrl } from '../../utils/assets';

export function LightboxModal() {
  const { isOpen, items, index, closeLightbox, nextImage, prevImage } = useLightbox();
  const [zoomed, setZoomed] = useState(false);
  const [imgStage, setImgStage] = useState<'local' | 'remote'>('local');

  const current = items[index];

  useEffect(() => {
    setZoomed(false);
    setImgStage('local');
  }, [index, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  if (!isOpen || !current) return null;

  const src =
    imgStage === 'local'
      ? getLocalImageUrl(current.filename)
      : getRemoteFallbackImageUrl(current.filename);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-tinta/95 p-4 text-lana backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      onClick={closeLightbox}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-trigo-soft">
          Galería Nobsa · {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Reducir zoom' : 'Ampliar imagen'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lana/20 bg-lana/10 text-lana transition hover:bg-lana/20"
          >
            {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar galería"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lana/20 bg-lana/10 text-lana transition hover:bg-grana"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Fotografía central */}
      <div
        className="relative my-4 flex flex-1 items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={prevImage}
            aria-label="Fotografía anterior"
            className="absolute left-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-lana/20 bg-tinta/75 text-lana transition hover:bg-grana sm:left-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <img
          src={src}
          alt={current.alt}
          onError={() => {
            if (imgStage === 'local') setImgStage('remote');
          }}
          onClick={() => setZoomed((z) => !z)}
          className={`max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl transition duration-300 ${
            zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Fotografía siguiente"
            className="absolute right-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-lana/20 bg-tinta/75 text-lana transition hover:bg-grana sm:right-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Pie editorial y crédito */}
      <div
        className="mx-auto max-w-3xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-base text-lana sm:text-lg">
          {current.caption || current.alt}
        </p>
        {current.credit && (
          <p className="mt-1 font-mono text-[11px] text-lana/65">{current.credit}</p>
        )}
      </div>
    </div>
  );
}
