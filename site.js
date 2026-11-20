// Alpha Global EU — the page is fully readable without this file.
(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }
  var hero = document.querySelector('[data-enter]');
  if (hero) setTimeout(function () { hero.classList.add('entered'); }, 100);

  var overlay = document.getElementById('modal-overlay');
  var opener = null;
  function closeLegal() {
    document.querySelectorAll('.legal-modal').forEach(function (m) { m.style.display = 'none'; });
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (opener) { opener.focus(); opener = null; }
  }
  document.querySelectorAll('[data-legal]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var m = document.getElementById('modal-' + a.dataset.legal);
      if (!m) return;
      opener = a;
      overlay.style.display = 'block';
      m.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      m.querySelector('.lm-close').focus();
    });
  });
  overlay.addEventListener('click', closeLegal);
  document.querySelectorAll('.legal-modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.lm-close')) closeLegal(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLegal(); });

  var form = document.getElementById('cf');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    var subject = v('subject') + (v('organization') ? ' — ' + v('organization') : '');
    var body = v('message') + '\n\n' + v('name') + (v('organization') ? '\n' + v('organization') : '') + '\n' + v('email');
    location.href = 'mailto:info@alpha-global.eu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
