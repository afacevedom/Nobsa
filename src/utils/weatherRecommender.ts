import type { NobsaWeatherData } from '../services/liveApis';
import type { Lang } from '../i18n/translations';

export interface RecommendedStop {
  placeId: string;
  reason: string;
}

export interface WeatherPlanRecommendation {
  tone: 'outdoor' | 'sheltered' | 'cozy';
  badge: string;
  headline: string;
  advice: string;
  stops: RecommendedStop[];
}

export function buildWeatherRecommendation(
  weather: NobsaWeatherData,
  lang: Lang
): WeatherPlanRecommendation {
  const isRainy =
    weather.conditionKind === 'rain' ||
    weather.conditionKind === 'storm' ||
    (weather.forecast[0]?.precipProb ?? 0) >= 65;

  const isCoolOrEvening =
    !weather.isDay ||
    weather.temperature < 13 ||
    weather.conditionKind === 'fog';

  if (isRainy) {
    if (lang === 'en') {
      return {
        tone: 'sheltered',
        badge: 'Best plan right now · Sheltered & craft',
        headline: 'Rain in the valley: ideal for wool workshops, stone heritage & wine',
        advice: `Current temperature is ${weather.temperature.toFixed(1)} °C with ${weather.humidity}% humidity. Pick sheltered stops in town and bring a rain jacket plus a warm wool ruana.`,
        stops: [
          {
            placeId: 'ruanas',
            reason: 'Browse 25+ family workshops of hand-loomed wool ruanas, ironwork, and carvings under cover.',
          },
          {
            placeId: 'pueblo',
            reason: 'Step inside the 1898 parish church to admire Anselmo Zárate’s carved altar and try regional sweets around the plaza.',
          },
          {
            placeId: 'vino',
            reason: 'Head to Marqués de Puntalarga Vineyard for an indoor highland wine tasting.',
          },
        ],
      };
    }
    return {
      tone: 'sheltered',
      badge: 'Plan recomendado ahora · Bajo techo y telar',
      headline: 'Tiempo lluvioso en el valle: ideal para ruanas, iglesia y cata de vino',
      advice: `Ahora hay ${weather.temperature.toFixed(1)} °C y ${weather.humidity}% de humedad. Conviene priorizar recorridos resguardados en el casco urbano y llevar chaqueta impermeable o ruana de lana.`,
      stops: [
        {
          placeId: 'ruanas',
          reason: 'Recorre los talleres de lana virgen, forja y talla de madera y piedra resguardado de la lluvia.',
        },
        {
          placeId: 'pueblo',
          reason: 'Visita la iglesia de 1898 (altar de Anselmo Zárate y cuadro de Zurbarán) y prueba dulces de fruta en la plaza.',
        },
        {
          placeId: 'vino',
          reason: 'Disfruta una cata bajo techo y conoce las bodegas del Viñedo Marqués de Puntalarga.',
        },
      ],
    };
  }

  if (isCoolOrEvening) {
    if (lang === 'en') {
      return {
        tone: 'cozy',
        badge: 'Best plan right now · Cool highland air',
        headline: 'Crisp Boyacá weather: plaza strolls, wool ruanas & warm flavors',
        advice: `Feels like ${weather.apparentTemperature.toFixed(1)} °C with ${weather.windSpeed} km/h wind. Perfect moment to wear a Nobsa wool ruana and explore the town center.`,
        stops: [
          {
            placeId: 'pueblo',
            reason: 'Walk the four-circle Main Square under the palms and try local fruit desserts and snacks.',
          },
          {
            placeId: 'ruanas',
            reason: 'Try on hand-loomed wool ruanas and natural-fiber garments straight from local artisans.',
          },
          {
            placeId: 'vino',
            reason: 'Pair the cool evening air with a tasting at Marqués de Puntalarga Vineyard.',
          },
        ],
      };
    }
    return {
      tone: 'cozy',
      badge: 'Plan recomendado ahora · Clima fresco de altura',
      headline: 'Ambiente fresco en Nobsa: tarde de plaza, ruana de lana y sabores locales',
      advice: `Sensación térmica de ${weather.apparentTemperature.toFixed(1)} °C y viento de ${weather.windSpeed} km/h. Momento perfecto para estrenar ruana nobsana y caminar sin afán por el centro.`,
      stops: [
        {
          placeId: 'pueblo',
          reason: 'Camina los cuatro círculos del Parque Principal y disfruta postres y mecato típico de la región.',
        },
        {
          placeId: 'ruanas',
          reason: 'Visita las tiendas de ruanas en lana virgen, cerámica y derivados de breva y uva.',
        },
        {
          placeId: 'vino',
          reason: 'Cierra la jornada con una cata o compra de botellas en el Viñedo Marqués de Puntalarga.',
        },
      ],
    };
  }

  // Tiempo despejado / parcialmente nublado y agradable -> miradores y montaña
  if (lang === 'en') {
    return {
      tone: 'outdoor',
      badge: 'Best plan right now · Clear skies & viewpoints',
      headline: 'Great visibility in Alto Chicamocha: time for viewpoints & mountain trails',
      advice: `${weather.temperature.toFixed(1)} °C and ${weather.windSpeed} km/h breeze. Wear sunscreen, comfortable shoes, and carry water if hiking toward El Tungón.`,
      stops: [
        {
          placeId: 'capilla',
          reason: 'Climb Monte El Calvario to Lourdes Chapel for the clearest panoramic view over Nobsa.',
        },
        {
          placeId: 'cruz',
          reason: 'Ideal conditions for the 3-hour hike or MTB climb up to Cruz de Aranda on El Tungón hill.',
        },
        {
          placeId: 'vino',
          reason: 'Enjoy bright sunlight across the Valle del Sol vineyards at Marqués de Puntalarga.',
        },
      ],
    };
  }

  return {
    tone: 'outdoor',
    badge: 'Plan recomendado ahora · Cielo abierto y miradores',
    headline: 'Buena visibilidad en el Alto Chicamocha: hora de miradores y sendero',
    advice: `Con ${weather.temperature.toFixed(1)} °C y brisa de ${weather.windSpeed} km/h es el mejor momento para actividades al aire libre. Lleva bloqueador solar, agua y calzado cómodo si subes a los cerros.`,
    stops: [
      {
        placeId: 'capilla',
        reason: 'Sube al monte El Calvario para aprovechar la panorámica despejada del casco urbano y el valle.',
      },
      {
        placeId: 'cruz',
        reason: 'Condiciones ideales para la caminata de ~3 horas o ruta MTB hacia la Cruz de Aranda.',
      },
      {
        placeId: 'vino',
        reason: 'Aprovecha la luz del Valle del Sol para recorrer y catar en el Viñedo Marqués de Puntalarga.',
      },
    ],
  };
}
