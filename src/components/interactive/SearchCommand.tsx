import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { searchNobsa } from '../../utils/search';
import { useLanguage } from '../../context/LanguageContext';

interface SearchCommandProps {
  open: boolean;
  onClose: () => void;
}

export function SearchCommand({ open, onClose }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const results = useMemo(() => searchNobsa(query), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-tinta/70 px-4 pt-16 backdrop-blur-sm sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label={t.searchBtn}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-tinta/15 bg-lana shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-tinta/10 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-grana" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-tinta placeholder:text-tinta-soft focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="rounded-lg p-1.5 text-tinta-muted hover:bg-lana-deep hover:text-tinta"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-tinta-muted">{t.searchEmpty}</p>
          ) : (
            <ul className="divide-y divide-tinta/5">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(item.route);
                      onClose();
                    }}
                    className="group flex w-full items-start justify-between gap-4 rounded-xl px-3.5 py-3 text-left transition hover:bg-lana-deep/70"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-tinta/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-grana">
                          {item.type}
                        </span>
                        <span className="truncate font-medium text-tinta">{item.title}</span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-tinta-muted">{item.subtitle}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-tinta-soft transition group-hover:text-grana" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
