export interface ReferenceSource {
  id: number;
  title: string;
  url: string;
  category: 'Institucional' | 'Enciclopédico y turístico' | 'Fotografía y comunidad';
}

export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    id: 1,
    title: 'Nobsa en Wikipedia',
    url: 'https://es.wikipedia.org/wiki/Nobsa',
    category: 'Enciclopédico y turístico',
  },
  {
    id: 2,
    title: 'Turismo en Nobsa — EnColombia',
    url: 'https://encolombia.com/turismo/destinos-turisticos/destinos-colombianos/boyaca/turismo-en-nobsa/',
    category: 'Enciclopédico y turístico',
  },
  {
    id: 3,
    title: 'Análisis de Situación de Salud (ASIS Nobsa 2020) — Gobernación de Boyacá',
    url: 'https://www.boyaca.gov.co/SecSalud/images/Documentos/asis2020/asis_nobsa_2020.pdf',
    category: 'Institucional',
  },
  {
    id: 4,
    title: 'Plan de Desarrollo de Nobsa 2020–2023 y reseña histórica',
    url: 'https://nobsaboyaca.micolombiadigital.gov.co/sites/nobsaboyaca/content/files/000173/8602_nobsa-en-camino-del-desarrollo-y-el-bienestar-20202023.pdf',
    category: 'Institucional',
  },
  {
    id: 5,
    title: 'Plan de Desarrollo de Nobsa (documento de archivo en Scribd)',
    url: 'https://es.scribd.com/document/372848192/Plan-de-Desarrollo-Nobsa',
    category: 'Institucional',
  },
  {
    id: 6,
    title: 'Tour de luces por Boyacá — Caminatas Ecológicas Bogotá',
    url: 'https://caminatasecologicasbogota.com/tour-de-luces-por-boyaca/',
    category: 'Enciclopédico y turístico',
  },
  {
    id: 7,
    title: 'Comunidad Nobsa en Facebook',
    url: 'https://www.facebook.com/nobsa',
    category: 'Fotografía y comunidad',
  },
  {
    id: 8,
    title: 'Fotografías de Felipe Acevedo (500px)',
    url: 'https://500px.com/p/felipeacevedom',
    category: 'Fotografía y comunidad',
  },
];

export const PROJECT_META = {
  contactEmail: 'afacevedom@unal.edu.co',
  licenseName: 'Mozilla Public License Version 2.0 (MPL-2.0)',
  mapAttribution: '© Colaboradores de OpenStreetMap (licencia ODbL) y Leaflet.',
  editorialDisclaimer:
    'Esta publicación es un proyecto cultural y editorial independiente dedicado a difundir el patrimonio, la geografía y las tradiciones de Nobsa, Boyacá. No constituye ni sustituye el portal oficial de la Alcaldía Municipal de Nobsa.',
};
