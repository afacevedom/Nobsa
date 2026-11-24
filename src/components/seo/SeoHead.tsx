import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SITE_NAME = 'Nobsa, Boyacá — Crónica de Lana, Piedra y Vid';
const DEFAULT_ORIGIN = 'https://afacevedom.github.io/Nobsa/';
const DEFAULT_IMAGE = 'https://afacevedom.github.io/Nobsa/imagenes/Parque.jpg';

export interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function getSiteOrigin(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  const raw = envUrl || DEFAULT_ORIGIN;
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let link = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    if (hreflang) link.setAttribute('hreflang', hreflang);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function SeoHead({
  title,
  description,
  path = '',
  keywords,
  image = DEFAULT_IMAGE,
  imageAlt = 'Nobsa, Boyacá, Colombia',
  type = 'website',
  jsonLd,
}: SeoHeadProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    const fullTitle = title.includes('Nobsa') ? title : `${title} | Nobsa, Boyacá`;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const canonicalUrl = cleanPath ? `${getSiteOrigin()}${cleanPath}/` : getSiteOrigin();

    document.title = fullTitle;
    upsertLink('canonical', canonicalUrl);
    upsertLink('alternate', canonicalUrl, 'es-CO');
    upsertLink('alternate', canonicalUrl, 'x-default');

    upsertMeta('name', 'description', description);
    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:locale', lang === 'en' ? 'en_US' : 'es_CO');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:alt', imageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    const existingDynamic = document.head.querySelector('script[data-seo-dynamic="true"]');
    if (existingDynamic) {
      existingDynamic.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-dynamic', 'true');
      const payload = Array.isArray(jsonLd)
        ? { '@context': 'https://schema.org', '@graph': jsonLd }
        : { '@context': 'https://schema.org', ...jsonLd };
      script.textContent = JSON.stringify(payload);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.head.querySelector('script[data-seo-dynamic="true"]');
      if (el) el.remove();
    };
  }, [title, description, path, keywords, image, imageAlt, type, jsonLd, lang]);

  return null;
}
