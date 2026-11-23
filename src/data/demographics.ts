export const DEMOGRAPHIC_KPI = [
  { label: 'Población proyectada (2020)', value: '16.446', detail: 'Proyección Censo DANE 2018 (+1.575 desde 2015)' },
  { label: 'Densidad poblacional', value: '310,3', unit: 'hab/km²', detail: 'Superior a Corrales, Floresta, Tibasosa y Tópaga' },
  { label: 'División rural', value: '11', unit: 'veredas', detail: 'Más el corregimiento de Belencito' },
  { label: 'Participación en Boyacá', value: '1,32 %', detail: 'Uno de los 123 municipios en 15 provincias' },
];

export const URBAN_RURAL_SPLIT = {
  ruralPct: 67.9,
  ruralPop: 11169,
  urbanPct: 32.1,
  urbanPop: 5277,
  source: 'Proyecciones Censo DANE 2018 para el año 2020 (ASIS Nobsa 2020)',
};

export const POPULATION_SERIES = [
  { year: '2005', population: 14946, note: 'Censo 2005' },
  { year: '2015', population: 14871, note: 'Estimación base (-1.575 vs 2020)' },
  { year: '2020', population: 16446, note: 'Proyección DANE 2018' },
  { year: '2023', population: 16773, note: 'Proyección ASIS (+327)' },
];

export const DEMOGRAPHIC_NOTES = [
  {
    title: 'Equilibrio por sexo y pirámide estacionaria',
    body: 'La pirámide poblacional de Nobsa es estacionaria, con base amplia y cúspide estrecha. En 2020 la relación fue de 92 hombres por cada 100 mujeres (igual que en 2015, proyectada a 93/100 en 2023).',
  },
  {
    title: 'Grupos de edad y movilidad',
    body: 'La mayor concentración se encuentra entre los 20 y 24 años (676 hombres y 688 mujeres) y la menor entre los 75 y 79 años. Se observan salidas temporales entre los 15–24 años por educación superior y 30–34 por empleo en ciudades intermedias, compensadas por la permanencia de la población productiva (25–59 años) y el retorno a partir de los 50 años.',
  },
  {
    title: 'Pertenencia étnica (DANE)',
    body: 'Según el autorreconocimiento censal, el 99,09 % de los habitantes no se adscribe a un grupo étnico específico, el 0,09 % se reconoce como afrocolombiano y el 0,82 % no informa.',
  },
];

export const TERRITORY_BORDERS = {
  north: 'Santa Rosa de Viterbo y Floresta',
  east: 'Corrales y Tópaga',
  south: 'Sogamoso y Tibasosa',
  west: 'Tibasosa y Santa Rosa de Viterbo',
};

export const ACCESS_DATA = [
  { label: 'Desde Bogotá', value: '195 km', detail: 'Hacia el norte por la Carretera Central del Norte' },
  { label: 'Desde Tunja', value: '71 km', detail: 'Capital del departamento de Boyacá' },
  { label: 'Región y Provincia', value: 'Sugamuxi', detail: 'Alto Chicamocha · Altiplano Cundiboyacense' },
  { label: 'Conectividad regional', value: '3 ejes', detail: 'Carretera Central del Norte, vía al Cusiana y conexión hacia la Costa Atlántica' },
];
