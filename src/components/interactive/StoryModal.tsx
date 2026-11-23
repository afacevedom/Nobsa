import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface StoryModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function StoryModal({ open, onClose, eyebrow, title, children }: StoryModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-tinta/15 bg-lana p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-tinta/15 bg-lana-soft text-tinta transition hover:bg-tinta hover:text-lana"
        >
          <X className="h-5 w-5" />
        </button>

        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-grana">{eyebrow}</p>
        )}
        <h3
          id="story-modal-title"
          className="mt-2 pr-10 font-display text-2xl font-semibold text-tinta sm:text-3xl"
        >
          {title}
        </h3>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
