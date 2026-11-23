import { useEffect } from 'react';

const SITE_NAME = 'Nobsa, Boyacá — Crónica de Lana, Piedra y Vid';
const SITE_ORIGIN = 'https://afacevedom.github.io/Nobsa/';
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

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
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
  useEffect(() => {
    const fullTitle = title.includes('Nobsa') ? title : `${title} | Nobsa, Boyacá`;
    const canonicalUrl = path ? `${SITE_ORIGIN}#${path}` : SITE_ORIGIN;

    document.title = fullTitle;
    upsertCanonical(canonicalUrl);

    upsertMeta('name', 'description', description);
    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:locale', 'es_CO');
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

    // JSON-LD dinámico por ruta
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
  }, [title, description, path, keywords, image, imageAlt, type, jsonLd]);

  return null;
}
