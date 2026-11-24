/**
 * Analítica respetuosa con la privacidad (cero cookies).
 * Solo se activa si configuras VITE_GOATCOUNTER_URL o VITE_CF_BEACON_TOKEN en tu despliegue.
 */
export function initPrivacyAnalytics(): void {
  if (typeof document === 'undefined' || !import.meta.env.PROD) return;

  const goatUrl = import.meta.env.VITE_GOATCOUNTER_URL as string | undefined;
  if (goatUrl) {
    const s = document.createElement('script');
    s.async = true;
    s.dataset.goatcounter = goatUrl;
    s.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(s);
    return;
  }

  const cfToken = import.meta.env.VITE_CF_BEACON_TOKEN as string | undefined;
  if (cfToken) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.dataset.cfBeacon = JSON.stringify({ token: cfToken });
    document.head.appendChild(s);
  }
}
