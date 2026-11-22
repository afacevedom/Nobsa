// Mapa de Nobsa: Leaflet + OpenStreetMap, filtros, lista y ficha de cada lugar.
// Los datos salen de #lugares-data (los genera tools/build.py desde tools/lugares.py).
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const data = JSON.parse($('#lugares-data').textContent);
  const byId = Object.fromEntries(data.lugares.map(p => [p.id, p]));
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, hasMap = !!window.L;
  const det = $('#detalle'), markers = {};
  let map, group, actual = null;

  const ajustar = () => { const b = group.getBounds(); if (b.isValid()) map.fitBounds(b, {padding: [56, 56], maxZoom: 16}); };
  const marcar = () => Object.entries(markers).forEach(([k, m]) => { const el = m.getElement(); if (el) el.classList.toggle('sel', k === actual); });

  function pintar(p) {
    const url = p.lat == null ? '' : `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`;
    det.innerHTML =
      (p.img ? `<img src="${esc(p.img)}" alt="${esc(p.nombre)}">` : '') +
      `<div><h3>${esc(p.nombre)}</h3><p class="cat">${p.cat.map(c => esc(data.categorias[c])).join(' · ')}</p>` +
      `<div class="txt">${p.texto.map(t => `<p>${esc(t)}</p>`).join('')}</div>` +
      `<div class="geo-actions">${p.texto.length > 1 ? '<button type="button" class="mas">Leer más</button>' : ''}` +
      `${p.video ? `<button type="button" class="ver" data-v="${esc(p.video)}">Ver video</button>` : ''}` +
      `${url ? `<a href="${url}" target="_blank" rel="noopener">Abrir en OpenStreetMap</a>` : ''}</div>` +
      `<div class="vid" hidden></div><p class="src">${url ? 'Ubicación: ' : ''}${esc(p.fuente)}</p></div>`;
  }

  function elegir(id, mover = true) {
    const p = byId[id]; if (!p) return; actual = id;
    $$('#lista button').forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id)));
    marcar(); pintar(p);
    if (hasMap && mover && p.lat != null) {
      const z = Math.max(map.getZoom(), 15);
      reduce ? map.setView([p.lat, p.lon], z) : map.flyTo([p.lat, p.lon], z, {duration: .8});
    }
  }

  if (hasMap) {
    $('.geo-fallback').remove();
    map = L.map('mapa-osm', {minZoom: 10, maxZoom: 18, scrollWheelZoom: false, dragging: !L.Browser.mobile});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores de OpenStreetMap</a>'}).addTo(map);
    map.on('focus', () => map.scrollWheelZoom.enable()).on('blur', () => map.scrollWheelZoom.disable());
    group = L.featureGroup().addTo(map);
    data.lugares.filter(p => p.lat != null).forEach(p => {
      markers[p.id] = L.marker([p.lat, p.lon], {title: p.nombre, alt: p.nombre,
        icon: L.divIcon({className: 'pin c-' + p.cat[0], html: `<span><b>${p.n}</b></span>`, iconSize: [44, 44], iconAnchor: [22, 44]})})
        .on('click', () => elegir(p.id, false)).addTo(group);
    });
    ajustar();
    addEventListener('load', () => map.invalidateSize());
  } else {
    $('.geo-fallback').textContent = 'No se pudo cargar el mapa. Puedes explorar los lugares en la lista.';
  }

  $('#lista').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    elegir(b.dataset.id);
    if (matchMedia('(max-width: 900px)').matches) $('.geo-map').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
  });

  $$('.geo-filters button').forEach(b => b.addEventListener('click', () => {
    $$('.geo-filters button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.f, ok = p => f === 'todos' || p.cat.includes(f);
    data.lugares.forEach(p => {
      $(`#lista [data-id="${p.id}"]`).closest('li').hidden = !ok(p);
      if (markers[p.id]) group[ok(p) ? 'addLayer' : 'removeLayer'](markers[p.id]);
    });
    if (hasMap) { ajustar(); marcar(); }
  }));

  det.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.classList.contains('mas')) t.textContent = $('.txt', det).classList.toggle('open') ? 'Leer menos' : 'Leer más';
    if (t.classList.contains('ver')) {
      const v = $('.vid', det); v.hidden = false;
      v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(t.dataset.v)}?autoplay=1" title="Video: ${esc(byId[actual].nombre)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      t.remove();
    }
  });
  elegir(data.lugares[0].id, false);
})();
