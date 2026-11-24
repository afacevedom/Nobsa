import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(INDEX_PATH)) {
  console.error('[prerender] No se encontró dist/index.html. Ejecuta vite build primero.');
  process.exit(1);
}

function normalizeSiteUrl(raw) {
  const fallback = 'https://afacevedom.github.io/Nobsa/';
  const cleaned = (raw || fallback).replace(/\/+$/, '') + '/';
  return cleaned;
}

function normalizeBasePath(raw) {
  if (!raw || raw === '/') return '/';
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

const SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL);
const BASE_PATH = normalizeBasePath(process.env.VITE_BASE_PATH);
const TODAY = new Date().toISOString().slice(0, 10);

const ROUTES = [
  {
    slug: '',
    title: 'Nobsa, Boyacá — Crónica de Lana, Piedra y Vid | Guía Cultural y Turística',
    description:
      'Descubre Nobsa, Boyacá (Colombia): tradición artesanal de la ruana, Viñedo Marqués de Puntalarga, Cruz de Aranda, historia desde 1593, mapa interactivo con GPX, clima en vivo y dólar hoy.',
    keywords:
      'Nobsa Boyacá, turismo Nobsa, ruana de Nobsa, Viñedo Marqués de Puntalarga, Cruz de Aranda, clima Nobsa hoy, Alto Chicamocha, Sugamuxi',
    image: `${SITE_URL}imagenes/Parque.jpg`,
    imageAlt: 'Parque Principal de Nobsa, Boyacá con palmeras y arquitectura tradicional',
    priority: '1.0',
    changefreq: 'weekly',
    noscriptHtml:
      '<h1>Nobsa, Boyacá — Crónica de Lana, Piedra y Vid</h1><p>Guía cultural independiente sobre Nobsa, Boyacá, Colombia: ruanas tejidas a mano, Viñedo Marqués de Puntalarga, Cruz de Aranda, mapa interactivo y calendario de festividades.</p>',
  },
  {
    slug: 'oficios',
    title: 'La Ruana de Nobsa, Artesanías y Sabores | Nobsa, Boyacá',
    description:
      'Conoce más de 25 talleres familiares de ruanas en lana de Nobsa, forja artesanal, campanas, talla en madera y piedra, vinos Marqués de Puntalarga y dulces de breva y uva.',
    keywords:
      'ruana de Nobsa, artesanías Nobsa Boyacá, lana virgen, forja artesanal, campanas artesanales, vinos Puntalarga, dulces de breva',
    image: `${SITE_URL}imagenes/NataliaParisRuana.jpg`,
    imageAlt: 'Ruana tejida en lana tradicional de Nobsa, Boyacá',
    priority: '0.9',
    changefreq: 'monthly',
    noscriptHtml:
      '<h1>La ruana de Nobsa y sus oficios artesanales</h1><p>Más de 25 artesanos y sus familias tejen ruanas en lana virgen junto a talleres de forja, campanas, talla en madera y piedra, cerámica y vinos del Marqués de Puntalarga.</p>',
  },
  {
    slug: 'territorio',
    title: 'Mapa Interactivo, Rutas GPX y Cómo Llegar a Nobsa | Nobsa, Boyacá',
    description:
      'Mapa interactivo de Nobsa con coordenadas verificadas en OpenStreetMap y Wikiloc, descarga de rutas GPX, Parque Principal, Capilla de Lourdes, Cruz de Aranda y cómo llegar desde Bogotá y Tunja.',
    keywords:
      'mapa de Nobsa, cómo llegar a Nobsa, Cruz de Aranda GPS GPX, Viñedo Marqués de Puntalarga ubicación, Capilla de Lourdes Nobsa',
    image: `${SITE_URL}imagenes/nobsamaps.png`,
    imageAlt: 'Vista aérea y mapa interactivo de Nobsa, Boyacá',
    priority: '0.9',
    changefreq: 'monthly',
    noscriptHtml:
      '<h1>Mapa interactivo y cómo llegar a Nobsa, Boyacá</h1><p>Nobsa está a 195 km al norte de Bogotá y a 71 km de Tunja por la Carretera Central del Norte, en la Provincia del Sugamuxi.</p>',
  },
  {
    slug: 'historia',
    title: 'Historia de Nobsa (1593) y Demografía DANE | Nobsa, Boyacá',
    description:
      'Historia verificada de Nobsa, Boyacá: resistencia del cacique Tundama (1539), fundación el 9 de enero de 1593, Acerías Paz del Río y retrato demográfico DANE (16.446 habitantes).',
    keywords:
      'historia de Nobsa, fundación de Nobsa 1593, Jerónimo Holguín, cacique Tundama, habitantes Nobsa DANE, Belencito, Acerías Paz del Río',
    image: `${SITE_URL}imagenes/desde-la-capilla-de-lourdes.jpg`,
    imageAlt: 'Panorámica histórica de Nobsa desde la Capilla de Lourdes',
    priority: '0.8',
    changefreq: 'monthly',
    noscriptHtml:
      '<h1>Historia de Nobsa y retrato de su gente</h1><p>Fundada el 9 de enero de 1593 por Jerónimo Holguín y Misael Millán, declarada municipio en 1811 y con 16.446 habitantes proyectados DANE 2020 (67,9 % rural).</p>',
  },
  {
    slug: 'agenda',
    title: 'Qué Hacer en Nobsa: Festividades y Recorridos | Nobsa, Boyacá',
    description:
      'Calendario anual de Nobsa, Boyacá: Festival de la Vid y el Vino en enero, Cruz de Aranda el 1.º de mayo, Día Mundial de la Ruana, San Roque, Festival Vallenato en noviembre y Navidad.',
    keywords:
      'qué hacer en Nobsa, fiestas de Nobsa, Día Mundial de la Ruana, Festival Vallenato Nobsa, Festival de la Vid y el Vino, alumbrado navideño Nobsa',
    image: `${SITE_URL}imagenes/ArbolNavidad.jpg`,
    imageAlt: 'Temporada navideña y celebraciones en Nobsa, Boyacá',
    priority: '0.9',
    changefreq: 'monthly',
    noscriptHtml:
      '<h1>Agenda de festividades y recorridos en Nobsa</h1><p>Siete celebraciones anuales y tres recorridos sugeridos por el casco urbano, el cerro El Tungón y el Valle del Sol.</p>',
  },
  {
    slug: 'mi-visita',
    title: 'Mi Visita a Nobsa — Planificador de Itinerario | Nobsa, Boyacá',
    description:
      'Arma, imprime en PDF, abre en Google Maps/Waze o descarga en GPX tu propio recorrido personalizado por los lugares y festividades de Nobsa, Boyacá.',
    keywords:
      'planear viaje a Nobsa, itinerario Nobsa Boyacá, ruta turística Nobsa, descargar GPX Nobsa',
    image: `${SITE_URL}imagenes/Parque.jpg`,
    imageAlt: 'Planificador personal de visita a Nobsa, Boyacá',
    priority: '0.7',
    changefreq: 'monthly',
    noscriptHtml:
      '<h1>Planificador Mi Visita a Nobsa</h1><p>Guarda lugares y celebraciones favoritas para organizar tu recorrido por Nobsa, Boyacá.</p>',
  },
  {
    slug: 'creditos',
    title: 'Créditos, Fuentes Documentales y APIs Abiertas | Nobsa, Boyacá',
    description:
      'Bibliografía, documentos DANE/ASIS 2020, créditos fotográficos, cartografía OpenStreetMap y APIs abiertas (Open-Meteo Clima/Aire, TRM Colombia y Nager.Date Festivos).',
    keywords: 'fuentes Nobsa, ASIS Nobsa 2020, OpenStreetMap Nobsa, créditos proyecto Nobsa',
    image: `${SITE_URL}imagenes/Parque.jpg`,
    imageAlt: 'Créditos y fuentes editoriales de Nobsa, Boyacá',
    priority: '0.5',
    changefreq: 'yearly',
    noscriptHtml:
      '<h1>Créditos editoriales y fuentes documentales</h1><p>Proyecto cultural independiente sobre Nobsa, Boyacá bajo licencia MPL-2.0.</p>',
  },
];

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function injectMeta(html, route) {
  const canonicalUrl = route.slug ? `${SITE_URL}${route.slug}/` : SITE_URL;
  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );
  out = out.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${escapeAttr(route.keywords)}" />`
  );
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
  );
  out = out.replace(
    /<link\s+rel="alternate"\s+hreflang="es-CO"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="es-CO" href="${escapeAttr(canonicalUrl)}" />`
  );
  out = out.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(canonicalUrl)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapeAttr(route.image)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image:alt" content="${escapeAttr(route.imageAlt)}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapeAttr(route.image)}" />`
  );
  out = out.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript><div style="max-width:760px;margin:2rem auto;padding:1.5rem;font-family:Georgia,serif;background:#F5F1E8;color:#161917;">${route.noscriptHtml}</div></noscript>`
  );

  return out;
}

const templateHtml = fs.readFileSync(INDEX_PATH, 'utf-8');

for (const route of ROUTES) {
  const html = injectMeta(templateHtml, route);
  if (!route.slug) {
    fs.writeFileSync(INDEX_PATH, html, 'utf-8');
  } else {
    const dir = path.join(DIST_DIR, route.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
  }
}

// Generar sitemap.xml con URLs limpias (sin #)
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => {
  const loc = r.slug ? `${SITE_URL}${r.slug}/` : SITE_URL;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

// Actualizar robots.txt con la URL exacta del sitemap
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');

// Generar 404.html inteligente para GitHub Pages (herencia .html + SPA fallback limpio)
const fallback404 = `<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirigiendo — Nobsa, Boyacá</title>
    <script>
      (function () {
        var base = ${JSON.stringify(BASE_PATH)};
        var legacy = {
          'historia.html': 'historia',
          'nuestra-gente.html': 'historia#gente',
          'ubicacion.html': 'territorio#como-llegar',
          'mapa.html': 'territorio',
          'que-hacer.html': 'agenda',
          'creditos.html': 'creditos'
        };
        var path = window.location.pathname;
        var file = path.split('/').pop() || '';
        if (legacy[file]) {
          window.location.replace(base + legacy[file]);
          return;
        }
        var rel = path.indexOf(base) === 0 ? path.slice(base.length) : path.replace(/^\\//, '');
        var target = encodeURIComponent(rel + window.location.search + window.location.hash);
        window.location.replace(base + '?p=' + target);
      })();
    </script>
  </head>
  <body style="font-family: system-ui, sans-serif; background: #F5F1E8; color: #161917; padding: 2rem;">
    <p>Redirigiendo a Nobsa, Boyacá… <a href="${BASE_PATH}">Ir al inicio</a>.</p>
  </body>
</html>
`;
fs.writeFileSync(path.join(DIST_DIR, '404.html'), fallback404, 'utf-8');

console.log(`[prerender] Generadas ${ROUTES.length} rutas estáticas limpias + sitemap.xml + 404.html para ${SITE_URL}`);
