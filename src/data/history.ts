import type { TimelineEvent } from '../types/nobsa';

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1539',
    title: 'Resistencia del cacique Tundama',
    summary:
      'En diciembre de 1539, tras los combates liderados por el cacique Tundama en el Llano de Bonza y el Pantano de Vargas, comienza el periodo de dominación española en la región.',
    accent: 'grana',
  },
  {
    year: '1593',
    title: 'Fundación de Nobsa (9 de enero)',
    summary:
      'El sábado 9 de enero de 1593, el hidalgo español Jerónimo Holguín en compañía de Misael Millán funda a Nobsa en calidad de pueblo de indios sobre tierras fértiles de vocación agrícola, ganadera y textil.',
    accent: 'trigo',
  },
  {
    year: '1703',
    title: 'Primeros archivos eclesiásticos conservados',
    summary:
      'A partir de este año se conservan documentos escritos de la historia eclesiástica local; los archivos antiguos de la alcaldía se perdieron en incendios durante las guerras civiles del siglo XIX y la Violencia de los años cuarenta.',
    accent: 'musgo',
  },
  {
    year: '1777',
    title: 'Separación parroquial de Tibasosa',
    summary:
      'Tras la evangelización iniciada por los padres Agustinos en el siglo XVI con la primera iglesia Doctrinera, Tibasosa —antes agregada junto con Chámeza y Firavitoba— se separa para conformar su propia parroquia.',
    accent: 'indigo',
  },
  {
    year: '1811',
    title: 'Declaración como municipio',
    summary:
      'Nobsa adquiere la categoría de municipio dentro de la transformación institucional que reemplazó los antiguos cabildos por alcaldías en la provincia del Sugamuxi.',
    accent: 'grana',
  },
  {
    year: '1886',
    title: 'Erección de la Cruz de Aranda',
    summary:
      'El párroco José Agustín Aranda levanta la primera cruz en madera forrada en lata sobre el cerro El Tungón, dando origen a una leyenda y a la peregrinación anual del 1.º de mayo.',
    accent: 'trigo',
  },
  {
    year: '1898',
    title: 'Construcción de la iglesia municipal',
    summary:
      'Se levanta el templo de tres naves de estilo dórico-barroco con torre en piedra tallada y altar en madera elaborado por el ebanista local Anselmo Zárate.',
    accent: 'musgo',
  },
  {
    year: '1948 – 1954',
    title: 'Nacimiento del polo siderúrgico y cementero',
    summary:
      'En 1948 nace la Empresa Siderúrgica Nacional de Paz de Río (producción plena en 1954 como Acerías Paz del Río), que junto con Cementos Boyacá / Holcim transforma el paisaje, la demografía y la economía municipal.',
    accent: 'indigo',
  },
];

export const HISTORICAL_CHAPTERS = [
  {
    id: 'origenes',
    kicker: 'Capítulo I · Siglo XVI',
    title: 'De la resistencia de Tundama a la fundación de 1593',
    paragraphs: [
      'Tras la batalla librada en diciembre de 1539 entre las comunidades indígenas lideradas por el cacique Tundama y las fuerzas conquistadoras en el Llano de Bonza y el Pantano de Vargas, se impuso el dominio español en el altiplano. Décadas después, el sábado 9 de enero de 1593, el hidalgo español Jerónimo Holguín junto con Misael Millán fundaron a Nobsa en calidad de pueblo de indios.',
      'La fertilidad de sus tierras determinó tempranamente que sus habitantes se dedicaran a la agricultura, la ganadería y a la naciente industria de los tejidos, raíces que aún definen el carácter laborioso y artesanal del municipio.',
    ],
  },
  {
    id: 'parroquia',
    kicker: 'Capítulo II · Siglos XVI – XIX',
    title: 'Iglesia Doctrinera, archivos perdidos y vida municipal',
    paragraphs: [
      'La evangelización comenzó en el siglo XVI con la llegada de los padres Agustinos y la construcción de la primera iglesia Doctrinera. En materia eclesiástica, los documentos conservados parten de 1703, pues gran parte de los archivos de la alcaldía fueron destruidos por el fuego durante las guerras civiles del siglo XIX y en los hechos de la Violencia de la década de 1940.',
      'Nobsa sostuvo una amplia relevancia eclesiástica regional hasta 1777, cuando Tibasosa —agregada entonces junto con Chámeza y Firavitoba— se constituyó como parroquia independiente. Con el paso del régimen de presidencias al Virreinato a mediados del siglo XVIII y la posterior vida republicana, Nobsa fue declarada municipio en 1811 dentro de la provincia del Sugamuxi.',
    ],
  },
  {
    id: 'industria',
    kicker: 'Capítulo III · Siglo XX y presente',
    title: 'Del valle agrícola al corredor industrial de Boyacá',
    paragraphs: [
      'Aunque se cuenta entre los municipios de menor extensión territorial de Boyacá, Nobsa desarrolló una dinámica económica singular al articular minería, industria pesada, artesanía, turismo, agricultura y ganadería. La instalación de Acerías Paz del Río y Cementos Boyacá (hoy Holcim) detonó procesos de migración laboral, urbanización acelerada, transformación del paisaje y la formación de asentamientos como Nazareth y Las Caleras.',
      'Su ubicación sobre la Carretera Central del Norte, en el eje que conecta a Bogotá con Belencito, convirtió al municipio en un corredor estratégico de transporte de carga y servicios. Hoy conviven allí la gran industria, el empuje de la micro y mediana empresa, el prestigio de sus talleres artesanales y una comunidad mestiza forjada por múltiples herencias culturales.',
    ],
  },
];
