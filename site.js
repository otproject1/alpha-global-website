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

  var form = document.getElementById('cf');
  if (form) {
    var KEY = 'c36d56a9-712d-4bd7-8b9e-074245ad47bd';
    var L = {
      pl: ['Wysyłanie…', 'Dziękujemy! Wiadomość została wysłana – odpowiemy w ciągu 24 godzin.', 'Nie udało się wysłać. Otwieramy Twój program pocztowy jako alternatywę.', 'Wiadomość trafia bezpośrednio do nas.'],
      en: ['Sending…', 'Thank you! Your message has been sent – we will reply within 24 hours.', 'Sending failed. We are opening your email app as a fallback.', 'Your message is sent directly to us.'],
      de: ['Wird gesendet…', 'Vielen Dank! Ihre Nachricht wurde gesendet – wir antworten innerhalb von 24 Stunden.', 'Senden fehlgeschlagen. Wir öffnen ersatzweise Ihr E-Mail-Programm.', 'Ihre Nachricht geht direkt an uns.'],
      ru: ['Отправка…', 'Спасибо! Сообщение отправлено – ответим в течение 24 часов.', 'Не удалось отправить. Открываем вашу почтовую программу.', 'Сообщение приходит напрямую к нам.'],
      uk: ['Надсилання…', 'Дякуємо! Повідомлення надіслано – відповімо протягом 24 годин.', 'Не вдалося надіслати. Відкриваємо вашу поштову програму.', 'Повідомлення надходить безпосередньо до нас.']
    };
    var t = L[document.documentElement.lang] || L.en;
    var hints = form.querySelectorAll('.f-hint');
    if (hints[0]) hints[0].textContent = t[3];
    var btn = form.querySelector('.f-btn');
    var status = document.createElement('p');
    status.className = 'f-hint';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
    var trap = document.createElement('input');
    trap.type = 'checkbox'; trap.name = 'botcheck'; trap.tabIndex = -1; trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(trap);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var subject = v('subject') + (v('organization') ? ' — ' + v('organization') : '');
      var payload = {
        access_key: KEY,
        subject: 'Alpha Global EU – ' + subject,
        from_name: 'Alpha Global EU Website',
        name: v('name'),
        company: v('organization'),
        email: v('email'),
        topic: v('subject'),
        message: v('message'),
        language: document.documentElement.lang,
        botcheck: trap.checked
      };
      if (btn) btn.disabled = true;
      status.textContent = t[0];
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.success) throw new Error('fail');
        status.textContent = t[1];
        form.reset();
      }).catch(function () {
        status.textContent = t[2];
        var body = v('message') + '\n\n' + v('name') + (v('organization') ? '\n' + v('organization') : '') + '\n' + v('email');
        location.href = 'mailto:info@alpha-global.eu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      }).then(function () { if (btn) btn.disabled = false; });
    });
  }
})();
