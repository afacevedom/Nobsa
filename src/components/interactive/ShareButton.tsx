import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export function ShareButton({ title, text, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Usuario canceló o navegador bloqueó share; fallback a portapapeles
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-full border border-tinta/15 bg-lana-soft px-4 py-2 text-xs font-medium text-tinta transition hover:border-grana hover:text-grana ${className}`}
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-musgo" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Compartir
        </>
      )}
    </button>
  );
}
