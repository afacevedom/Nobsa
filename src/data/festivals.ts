import type { Festival, FestivalCategory, Journey } from '../types/nobsa';

export const FESTIVAL_CATEGORIES: Record<FestivalCategory, string> = {
  fe: 'Fe y tradición',
  artesania: 'Artesanía y vino',
  musica: 'Música y cultura',
  estacional: 'Temporada',
};

export const FESTIVALS: Festival[] = [
  {
    id: 'vid-y-vino',
    monthLabel: 'Enero',
    monthOrder: 1,
    title: 'Festival de la Vid y el Vino',
    category: 'artesania',
    image: 'vinos.jpg',
    imageAlt: 'Viñedo Marqués de Puntalarga durante temporada de catas',
    excerpt: 'Cata de vinos locales y encuentro enológico en el Viñedo Marqués de Puntalarga, en el Valle del Sol.',
    fullText:
      'Cada enero, el Viñedo Marqués de Puntalarga abre sus puertas al Festival de la Vid y el Vino, una cita dedicada a los colores, aromas y sabores vitivinícolas del Alto Chicamocha donde los visitantes pueden catar y adquirir botellas producidas en Nobsa.',
    relatedPlaceId: 'vino',
  },
  {
    id: 'semana-mayor',
    monthLabel: 'Marzo / Abril',
    monthOrder: 3,
    title: 'Celebración de la Semana Mayor',
    category: 'fe',
    image: 'Semanamayor.jpg',
    imageAlt: 'Celebración religiosa de Semana Mayor en Nobsa, Boyacá',
    excerpt: 'Jornadas de recogimiento, procesiones y liturgia en el templo parroquial y las capillas del municipio.',
    fullText:
      'Dentro del circuito de los 123 municipios de Boyacá que acogen a miles de viajeros en Semana Santa, Nobsa celebra la Semana Mayor con actividades religiosas en torno a su iglesia de 1898 y la Capilla de Lourdes, en un ambiente de reflexión y encuentro comunitario.',
    relatedPlaceId: 'pueblo',
  },
  {
    id: 'peregrinacion-cruz',
    monthLabel: '1.º de mayo',
    monthOrder: 5,
    title: 'Peregrinación y Carrera a la Cruz de Aranda',
    category: 'fe',
    image: 'Cruz_de_Aranda.jpg',
    imageAlt: 'Camino rural y monumento de la Cruz de Aranda en Nobsa',
    excerpt: 'Caminata tradicional de unas tres horas y competencia atlética hasta el cerro El Tungón.',
    fullText:
      'Cada 1.º de mayo, coincidiendo con el Día del Trabajador, jóvenes y adultos ascienden en peregrinación y carrera atlética desde el casco urbano hasta la Cruz de Aranda, renovando la memoria de la cruz erigida en 1886 por el padre José Agustín Aranda.',
    relatedPlaceId: 'cruz',
  },
  {
    id: 'dia-mundial-ruana',
    monthLabel: 'Mitad de año',
    monthOrder: 6,
    title: 'Día Mundial de la Ruana',
    category: 'artesania',
    image: 'NataliaParisRuana.jpg',
    imageAlt: 'Ruana tejida en lana de Nobsa durante el Día Mundial de la Ruana',
    excerpt: 'El gran homenaje a los más de 25 talleres familiares que tejen en lana la prenda insignia del municipio.',
    fullText:
      'A mitad de año, Nobsa celebra el Día Mundial de la Ruana en honor a las familias tejedoras que han preservado este oficio durante generaciones. La destreza local ha dado origen a hitos como la ruana más grande del mundo (35 metros de largo por 20 de ancho) y piezas obsequiadas a personalidades como el Papa Francisco, Vicente Fernández y Luis Miguel.',
    relatedPlaceId: 'ruanas',
  },
  {
    id: 'san-roque',
    monthLabel: 'Septiembre (8 sep)',
    monthOrder: 9,
    title: 'Festividades en Honor a San Roque',
    category: 'fe',
    image: 'SanRoque.jpg',
    imageAlt: 'Celebración patronal en honor a San Roque en Nobsa',
    excerpt: 'Romería patronal cada 8 de septiembre en torno al santo protector de los enfermos y necesitados.',
    fullText:
      'En septiembre, con romería central el día 8, la parroquia y los habitantes de Nobsa veneran el cuadro de San Roque, patrono del municipio reconocido tradicionalmente como intercesor frente a enfermedades y epidemias.',
    relatedPlaceId: 'pueblo',
  },
  {
    id: 'festival-vallenato',
    monthLabel: 'Noviembre',
    monthOrder: 11,
    title: 'Festival Vallenato de Nobsa',
    category: 'musica',
    image: 'festivalvallenato.jpg',
    imageAlt: 'Presentación musical en el Festival Vallenato de Nobsa',
    excerpt: 'Más de tres décadas de concursos e interpretación tradicional que hermanan a Boyacá con el acordeón.',
    fullText:
      'A lo largo de más de tres décadas, el Festival Vallenato de Nobsa ha consolidado una reputación por su exigente nivel interpretativo, convirtiendo a noviembre en una cita infaltable para los seguidores del vallenato tradicional en el altiplano boyacense.',
    relatedPlaceId: 'pueblo',
  },
  {
    id: 'temporada-navidena',
    monthLabel: 'Diciembre y enero',
    monthOrder: 12,
    title: 'Temporada Navideña y Ruta de Luces',
    category: 'estacional',
    image: 'ArbolNavidad.jpg',
    imageAlt: 'Alumbrado navideño en el parque principal de Nobsa',
    excerpt: 'Iluminación festiva en la plaza, mercados artesanales, dulces de frutas y gastronomía boyacense.',
    fullText:
      'Entre diciembre y enero, Nobsa se suma a los recorridos navideños más visitados de Boyacá: el parque y la iglesia se iluminan mientras las tiendas de artesanías y los puestos de dulces y comidas típicas reciben a familias y viajeros.',
    relatedPlaceId: 'pueblo',
  },
];

export const SUGGESTED_JOURNEYS: Journey[] = [
  {
    id: 'telar-y-piedra',
    title: 'Ruta del Telar y la Piedra',
    duration: 'Medio día',
    pace: 'Caminata urbana suave',
    summary: 'Ideal para una primera visita: patrimonio arquitectónico, oficios textiles y sabores locales sin salir del casco urbano.',
    stops: [
      {
        placeId: 'pueblo',
        label: 'Parque Principal e Iglesia de 1898',
        note: 'Recorre los cuatro círculos bajo las palmeras y entra a ver la torre tallada en piedra y el altar de Anselmo Zárate.',
      },
      {
        placeId: 'ruanas',
        label: 'Calle de Ruanas y Artesanías',
        note: 'Visita talleres de lana, talla en piedra, forja y prueba dulces derivados de la breva y la uva.',
      },
      {
        placeId: 'capilla',
        label: 'Mirador y Capilla de Lourdes',
        note: 'Sube al monte El Calvario para contemplar el caserío y el valle al atardecer.',
      },
    ],
  },
  {
    id: 'sendero-el-tungon',
    title: 'Sendero de Fe y Montaña al Tungón',
    duration: 'Jornada de mañana (3 h ida)',
    pace: 'Exigente · Senderismo o MTB',
    summary: 'Para caminantes y ciclomontañistas que quieren conectar los miradores con la leyenda rural de la Cruz de Aranda.',
    stops: [
      {
        placeId: 'capilla',
        label: 'Paso por El Calvario y Capilla de Lourdes',
        note: 'Inicio de la ruta panorámica en ascenso desde el borde urbano.',
      },
      {
        placeId: 'cruz',
        label: 'Cumbre de la Cruz de Aranda',
        note: 'Paraje del cerro El Tungón donde se conserva la historia de las cruces de 1886 y 1931.',
      },
      {
        placeId: 'pueblo',
        label: 'Regreso al Parque Principal',
        note: 'Descanso bajo las palmeras con postres y mecato regional.',
      },
    ],
  },
  {
    id: 'vid-y-corredor',
    title: 'Valle del Sol y Paisaje Industrial',
    duration: 'Tarde completa',
    pace: 'Recorrido en vehículo',
    summary: 'Contrasta las dos caras contemporáneas de Nobsa: la viticultura del Valle del Sol y la escala del corredor siderúrgico y cementero.',
    stops: [
      {
        placeId: 'vino',
        label: 'Viñedo Marqués de Puntalarga',
        note: 'Cata guiada y compra de botellas producidas en el municipio.',
      },
      {
        placeId: 'holcim',
        label: 'Corredor de Cementos Holcim',
        note: 'Acceso sobre la Carretera Central del Norte hacia el casco urbano.',
      },
      {
        placeId: 'acerias',
        label: 'Sector Belencito · Acerías Paz del Río',
        note: 'Vista exterior del polo siderúrgico que marcó la historia moderna del Sugamuxi.',
      },
    ],
  },
];
