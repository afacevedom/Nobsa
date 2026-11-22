// Barra, menú móvil, riel de capítulos y "leer más"
(() => {
  const $ = (s) => [...document.querySelectorAll(s)];
  const bar = $('.bar')[0], b = $('.burger')[0], m = $('#menu')[0];
  const sc = () => bar.classList.toggle('solid', scrollY > 40); sc(); addEventListener('scroll', sc, {passive: true});
  const cierra = () => { m.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); };
  b.onclick = () => b.setAttribute('aria-expanded', m.classList.toggle('open'));
  $('#menu a').forEach(a => a.addEventListener('click', cierra));
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
    $('.rail a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id))), {rootMargin: '-45% 0px -50% 0px'});
  $('main>section[id]').forEach(s => io.observe(s));
  $('.more').forEach(x => x.onclick = () => { x.textContent = x.closest('.card').classList.toggle('open') ? 'Leer menos' : 'Leer más'; });
})();
