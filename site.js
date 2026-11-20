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

  // Hero motion: quiet trade-route lines with light pulses and a few drifting points.
  (function () {
    var host = document.querySelector('.hero-bg');
    if (!host || !host.getContext && !document.createElement('canvas').getContext) return;
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    host.appendChild(c);
    var x = c.getContext('2d');
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W = 0, H = 0, hub, routes = [], dots = [], run = false, last = 0;
    var ENDS = [[1.03, .14, 1], [1.03, .52, 1], [1.03, .9, 1], [.56, -.04, 0], [.3, 1.04, 0], [.62, 1.04, 0], [-.03, .93, 0]];

    function size() {
      var r = host.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      c.width = W * d; c.height = H * d;
      x.setTransform(d, 0, 0, d, 0, 0);
      hub = W > 1100 ? { x: W * .7, y: H * .5 } : { x: W * .8, y: H * .2 };
      routes = ENDS.map(function (e, i) {
        var ex = e[0] * W, ey = e[1] * H, mx = (hub.x + ex) / 2, my = (hub.y + ey) / 2;
        var dx = ex - hub.x, dy = ey - hub.y, k = (i % 2 ? .22 : -.22);
        return { ex: ex, ey: ey, cx: mx - dy * k, cy: my + dx * k, inb: e[2], t: (i * .37) % 1, v: .055 + (i % 3) * .018, wait: i * .6 };
      });
      dots = [];
      for (var n = Math.round(W * H / 26000), j = 0; j < n; j++) {
        dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + .3, p: Math.random() * 6.28, v: Math.random() * .5 + .2 });
      }
      if (still) draw(0);
    }
    function at(r, t) {
      var u = r.inb ? 1 - t : t, a = 1 - u;
      return { x: a * a * hub.x + 2 * a * u * r.cx + u * u * r.ex, y: a * a * hub.y + 2 * a * u * r.cy + u * u * r.ey };
    }
    function draw(dt) {
      x.clearRect(0, 0, W, H);
      var i, r, q;
      for (i = 0; i < dots.length; i++) {
        q = dots[i]; q.p += dt * q.v; q.y -= dt * 3; if (q.y < -4) q.y = H + 4;
        x.fillStyle = 'rgba(160,190,255,' + (.1 + .16 * (1 + Math.sin(q.p)) / 2) + ')';
        x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.28); x.fill();
      }
      x.lineWidth = 1;
      for (i = 0; i < routes.length; i++) {
        r = routes[i];
        x.strokeStyle = 'rgba(59,130,246,.18)';
        x.beginPath(); x.moveTo(hub.x, hub.y); x.quadraticCurveTo(r.cx, r.cy, r.ex, r.ey); x.stroke();
        if (still) continue;
        if (r.wait > 0) { r.wait -= dt; continue; }
        r.t += dt * r.v;
        if (r.t >= 1) { r.t = 0; r.wait = 1.5 + Math.random() * 3; continue; }
        for (var s = 0; s < 14; s++) {
          var tt = r.t - s * .012; if (tt < 0) break;
          q = at(r, tt);
          x.fillStyle = (r.inb ? 'rgba(6,182,212,' : 'rgba(96,165,250,') + (.75 * (1 - s / 14)) + ')';
          x.beginPath(); x.arc(q.x, q.y, 1.9 * (1 - s / 20), 0, 6.28); x.fill();
        }
        q = at(r, r.t);
        var g = x.createRadialGradient(q.x, q.y, 0, q.x, q.y, 14);
        g.addColorStop(0, r.inb ? 'rgba(6,182,212,.35)' : 'rgba(96,165,250,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.beginPath(); x.arc(q.x, q.y, 14, 0, 6.28); x.fill();
      }
    }
    function frame(now) {
      if (!run) return;
      var dt = Math.min((now - last) / 1000, .05); last = now;
      draw(dt);
      requestAnimationFrame(frame);
    }
    function start() { if (run || still) return; run = true; last = performance.now(); requestAnimationFrame(frame); }
    function stop() { run = false; }
    size();
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting && !document.hidden ? start() : stop(); }).observe(host);
    } else start();
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  })();

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
