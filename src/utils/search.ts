import { PLACES } from '../data/places';
import { FESTIVALS } from '../data/festivals';
import { TIMELINE_EVENTS } from '../data/history';
import { CRAFTS_AND_FLAVORS } from '../data/crafts';
import type { SearchResult } from '../types/nobsa';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const ALL_ITEMS: (SearchResult & { searchable: string })[] = [
  ...PLACES.map((p) => ({
    id: `place-${p.id}`,
    title: p.name,
    subtitle: p.summary,
    type: 'Lugar' as const,
    route: `/territorio?lugar=${p.id}`,
    searchable: normalize(`${p.name} ${p.summary} ${p.paragraphs.join(' ')} ${p.highlightTag}`),
  })),
  ...FESTIVALS.map((f) => ({
    id: `fest-${f.id}`,
    title: f.title,
    subtitle: `${f.monthLabel} · ${f.excerpt}`,
    type: 'Festividad' as const,
    route: `/agenda?evento=${f.id}`,
    searchable: normalize(`${f.title} ${f.monthLabel} ${f.excerpt} ${f.fullText}`),
  })),
  ...CRAFTS_AND_FLAVORS.map((c) => ({
    id: `craft-${c.id}`,
    title: c.name,
    subtitle: `${c.tagline} · ${c.description}`,
    type: 'Oficio' as const,
    route: `/oficios#${c.id}`,
    searchable: normalize(`${c.name} ${c.tagline} ${c.description}`),
  })),
  ...TIMELINE_EVENTS.map((t) => ({
    id: `hist-${t.year}`,
    title: `${t.year} — ${t.title}`,
    subtitle: t.summary,
    type: 'Historia' as const,
    route: `/historia`,
    searchable: normalize(`${t.year} ${t.title} ${t.summary}`),
  })),
];

export function searchNobsa(query: string): SearchResult[] {
  const q = normalize(query.trim());
  if (!q) {
    return ALL_ITEMS.slice(0, 6).map((entry) => ({
      id: entry.id,
      title: entry.title,
      subtitle: entry.subtitle,
      type: entry.type,
      route: entry.route,
    }));
  }
  return ALL_ITEMS.filter((item) => item.searchable.includes(q))
    .slice(0, 12)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      subtitle: entry.subtitle,
      type: entry.type,
      route: entry.route,
    }));
}
