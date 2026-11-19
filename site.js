// Alpha Global EU — small enhancements; the page works without this file.
document.querySelectorAll('[data-open]').forEach(function (b) {
  b.addEventListener('click', function () {
    var d = document.getElementById(b.dataset.open);
    if (d && d.showModal) d.showModal();
  });
});
document.querySelectorAll('dialog').forEach(function (d) {
  d.addEventListener('click', function (e) {
    if (e.target === d || e.target.closest('.x')) d.close();
  });
});
var form = document.getElementById('inquiry');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    var subject = v('subject') + (v('organization') ? ' — ' + v('organization') : '');
    var body = v('message') + '\n\n' + v('name') + (v('organization') ? '\n' + v('organization') : '') + '\n' + v('email');
    location.href = 'mailto:info@alpha-global.eu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}
