export type PlaceCategory = 'pueblo' | 'fe' | 'paisaje' | 'tradicion' | 'industria';

export interface Place {
  id: string;
  number: number;
  name: string;
  categories: PlaceCategory[];
  lat: number | null;
  lon: number | null;
  image: string | null;
  imageAlt: string;
  videoId: string | null;
  summary: string;
  paragraphs: string[];
  legend?: {
    title: string;
    subtitle: string;
    paragraphs: string[];
  };
  sourceNote: string;
  highlightTag: string;
}

export type FestivalCategory = 'fe' | 'artesania' | 'musica' | 'estacional';

export interface Festival {
  id: string;
  monthLabel: string;
  monthOrder: number;
  title: string;
  category: FestivalCategory;
  image: string;
  imageAlt: string;
  excerpt: string;
  fullText: string;
  relatedPlaceId?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  summary: string;
  accent: 'grana' | 'trigo' | 'musgo' | 'indigo';
}

export interface CraftItem {
  id: string;
  name: string;
  category: 'textil' | 'oficio' | 'sabor';
  tagline: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface Journey {
  id: string;
  title: string;
  duration: string;
  pace: string;
  summary: string;
  stops: {
    placeId: string;
    label: string;
    note: string;
  }[];
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'Lugar' | 'Festividad' | 'Historia' | 'Oficio';
  route: string;
}
