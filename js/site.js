// Menú móvil accesible y marcado de la página actual
(() => {
  const b = document.querySelector('.burger'), n = document.getElementById('nav');
  if (b && n) b.addEventListener('click', () => b.setAttribute('aria-expanded', n.classList.toggle('open')));
  const here = location.pathname.split('/').pop() || 'index.html';
  n && n.querySelectorAll('a').forEach(a => a.getAttribute('href') === here && a.setAttribute('aria-current', 'page'));
})();
// Cabecera sólida al desplazarse
(() => { const h = document.querySelector('.site-header'); if (!h) return;
  const f = () => h.classList.toggle('is-solid', scrollY > 40); f(); addEventListener('scroll', f, {passive: true}); })();
