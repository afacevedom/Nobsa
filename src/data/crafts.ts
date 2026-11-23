import type { CraftItem } from '../types/nobsa';

export const RUANA_HIGHLIGHTS = [
  { value: '25+', label: 'Artesanos y familias tejedoras dedicadas a la lana en Nobsa' },
  { value: '35 × 20 m', label: 'Dimensiones de la ruana más grande del mundo tejida en el municipio' },
  { value: 'Mitad de año', label: 'Celebración anual del Día Mundial de la Ruana' },
];

export const CRAFTS_AND_FLAVORS: CraftItem[] = [
  {
    id: 'ruana-lana',
    name: 'Ruana en lana virgen',
    category: 'textil',
    tagline: 'Emblema de identidad nobsana',
    description:
      'Más de 25 artesanos y sus familias mantienen vivo el tejido de ruanas en lana natural. Sus talleres han confeccionado piezas emblemáticas —desde la ruana más grande del mundo hasta ruanas entregadas al Papa Francisco, Vicente Fernández y Luis Miguel.',
    image: 'NataliaParisRuana.jpg',
    imageAlt: 'Ruana tejida en lana de Nobsa',
  },
  {
    id: 'fibras-naturales',
    name: 'Tejidos de fibras naturales',
    category: 'textil',
    tagline: 'Hilo, textura y abrigo del altiplano',
    description:
      'Junto a la ruana clásica, la comunidad artesanal produce prendas y piezas textiles en fibras naturales que se exhiben en las tiendas del casco urbano durante todo el año.',
    image: 'nobsa-vía-principal-boyacá.jpg',
    imageAlt: 'Tiendas de tejidos y artesanías en la vía principal de Nobsa',
  },
  {
    id: 'forja-y-campanas',
    name: 'Forja artesanal y campanas',
    category: 'oficio',
    tagline: 'Metal trabajado al fuego',
    description:
      'La tradición nobsana con el metal se manifiesta tanto en la forja artesanal como en la elaboración de campanas artesanales, un saber singular dentro de la provincia del Sugamuxi.',
  },
  {
    id: 'talla-madera-piedra',
    name: 'Talla en madera, piedra y muebles rústicos',
    category: 'oficio',
    tagline: 'Herencia de ebanistas y canteros',
    description:
      'Desde la torre en piedra tallada y el altar en madera del ebanista local Anselmo Zárate (1898) hasta los talleres actuales de muebles rústicos y talla en madera y piedra.',
    image: 'IglesiaNavidad.jpg',
    imageAlt: 'Torre en piedra tallada de la iglesia municipal de Nobsa',
  },
  {
    id: 'ceramica',
    name: 'Cerámica artesanal',
    category: 'oficio',
    tagline: 'Tierra moldeada del valle',
    description:
      'Piezas utilitarias y decorativas en barro cocido que complementan el mosaico de oficios manuales del municipio.',
  },
  {
    id: 'vino-puntalarga',
    name: 'Vinos del Marqués de Puntalarga',
    category: 'sabor',
    tagline: 'Viticultura en el Valle del Sol',
    description:
      'Catas y botellas producidas en el viñedo local de Puntalarga, protagonista cada enero durante el Festival de la Vid y el Vino.',
    image: 'vinos.jpg',
    imageAlt: 'Vinos producidos en el Viñedo Marqués de Puntalarga',
  },
  {
    id: 'breva-uva-postres',
    name: 'Derivados de breva, uva y mecato boyacense',
    category: 'sabor',
    tagline: 'Dulces de plaza y carretera',
    description:
      'Alrededor del Parque Principal y en los paraderos de llegada al municipio se encuentran dulces y productos derivados de la breva y la uva, frutas frescas, postres y mecato típico de la región.',
    image: 'Parque.jpg',
    imageAlt: 'Parque principal de Nobsa rodeado de comercio local y palmeras',
  },
];
