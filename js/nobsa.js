// Menú y fichas (<dialog>), contador de escenas y "leer más"
(() => {
  const $ = (s) => [...document.querySelectorAll(s)];
  const menu = $('#menu')[0], c = $('.count')[0], total = $('.scene').length;
  $('#abre-menu')[0].onclick = () => menu.showModal();
  $('[data-dialog]').forEach(b => b.onclick = () => document.getElementById(b.dataset.dialog).showModal());
  $('.cierra').forEach(b => b.onclick = () => b.closest('dialog').close());
  $('#menu a').forEach(a => a.addEventListener('click', () => menu.close()));
  $('dialog').forEach(d => d.addEventListener('click', e => e.target === d && d.close()));
  const f = () => { const n = Math.floor((scrollY + innerHeight / 2) / innerHeight) + 1;
    c.hidden = n > total; c.textContent = String(Math.min(n, total)).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'); };
  f(); addEventListener('scroll', f, {passive: true});
  $('.more').forEach(x => x.onclick = () => { x.textContent = x.closest('.card').classList.toggle('open') ? 'Leer menos' : 'Leer más'; });
})();
