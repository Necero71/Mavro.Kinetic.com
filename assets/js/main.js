(function () {
  'use strict';

  /* ---- Contact settings: fill these in and the send buttons appear ----
     whatsapp: international number, digits only, e.g. '27821234567'
     email:    e.g. 'you@example.com'                                */
  var CONTACT = { whatsapp: '27685271491', email: 'mavro.kinetic@gmail.com' };

  /* ---- Social links for the Gaming view: add a full https:// URL and the link appears ---- */
  var SOCIALS = [
    { name: 'Instagram', url: '' },
    { name: 'TikTok',    url: '' },
    { name: 'YouTube',   url: '' },
    { name: 'Twitch',    url: '' }
  ];

  var $ = function (s) { return document.querySelector(s); };
  var root = document.documentElement;

  /* ---- Mobile menu ---- */
  var menuBtn = $('#menu-btn'), nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---- View switch: Business <-> Gaming ---- */
  var BUSINESS_TITLE = document.title;
  var GAMING_TITLE = 'Mavro Kinetic | Gaming and sim racing';
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="view"]'));
  var mainEl = $('#main'), live = $('#view-live');
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var view = root.getAttribute('data-view') === 'gaming' ? 'gaming' : 'business';
  if (view === 'business') BUSINESS_TITLE = document.title;
  else BUSINESS_TITLE = 'Mavro Kinetic | Websites, branding and web apps from Cape Town';

  function paintView(v) {
    view = v;
    root.setAttribute('data-view', v);
    radios.forEach(function (r) { r.checked = (r.value === v); });
    document.title = v === 'gaming' ? GAMING_TITLE : BUSINESS_TITLE;
  }
  paintView(view);

  function setView(v, keepFocus) {
    if ((v !== 'gaming' && v !== 'business') || v === view) return;
    var apply = function () {
      paintView(v);
      setMenu(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
      try { localStorage.setItem('mk-view', v); } catch (e) { /* private mode */ }
      try {
        var u = new URL(location.href);
        if (v === 'gaming') u.searchParams.set('view', 'gaming'); else u.searchParams.delete('view');
        u.hash = '';
        history.replaceState(null, '', u);
      } catch (e) { /* file:// etc */ }
      live.textContent = v === 'gaming' ? 'Showing gaming and sim racing' : 'Showing business';
      if (!keepFocus) mainEl.focus({ preventScroll: true });
      mainEl.classList.remove('swap');
    };
    if (reduceMotion) { apply(); return; }
    mainEl.classList.add('swap');
    setTimeout(apply, 140);
  }

  radios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setView(r.value, true); }); });
  $('#m-track').addEventListener('click', function () { setView(view === 'gaming' ? 'business' : 'gaming', true); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-view]'); if (b) setView(b.getAttribute('data-set-view'), false);
  });

  /* Social pills (only links you have filled in above) */
  var liveSocials = SOCIALS.filter(function (s) { return /^https?:\/\//.test(s.url); });
  if (liveSocials.length) {
    var sList = $('#social-list');
    liveSocials.forEach(function (s) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = s.url; a.textContent = s.name; a.target = '_blank'; a.rel = 'noopener noreferrer';
      li.appendChild(a); sList.appendChild(li);
    });
    sList.hidden = false;
    $('#find-note').textContent = 'Racing, builds and updates. Pick a platform.';
  }

  /* ---- Start-lights intro: five lamps, lights out, number launches (runs on the view you land on) ---- */
  var hero = $('.hero[data-view-only="' + view + '"]');
  var lamps = hero ? Array.prototype.slice.call(hero.querySelectorAll('.lamp')) : [];
  if (root.classList.contains('arm') && hero) {
    var step = 280, start = 400;
    lamps.forEach(function (l, i) { setTimeout(function () { l.classList.add('lit'); }, start + i * step); });
    setTimeout(function () {
      lamps.forEach(function (l) { l.classList.remove('lit'); });
      hero.classList.add('go');
    }, start + lamps.length * step + 450);
  }

  /* ---- Brief builder ---- */
  var form = $('#brief-form'), out = $('#brief-out'), status = $('#status');
  var waBtn = $('#wa-btn'), mailBtn = $('#mail-btn'), note = $('#contact-note');

  function build() {
    var f = form.elements;
    var name = f.name.value.trim(), biz = f.biz.value.trim();
    var needs = Array.prototype.slice.call(form.querySelectorAll('input[name="need"]:checked'))
      .map(function (c) { return c.value; });
    var when = f.when.value.trim(), details = f.details.value.trim();

    var lines = ['Hi Mavro Kinetic,', ''];
    var who = name ? "I'm " + name : "I'd like to start a project";
    if (biz) who += (name ? ' from ' : ' for ') + biz;
    lines.push(who + '.');
    if (needs.length) {
      var list = needs.length > 1 ? needs.slice(0, -1).join(', ') + ' and ' + needs[needs.length - 1] : needs[0];
      lines.push('I need ' + list + '.');
    }
    if (when) lines.push('Timing: ' + when + '.');
    if (details) lines.push('', details);
    var text = lines.join('\n');
    out.value = text;

    if (CONTACT.whatsapp) waBtn.href = 'https://wa.me/' + CONTACT.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
    if (CONTACT.email) mailBtn.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('Project brief') + '&body=' + encodeURIComponent(text);
    return text;
  }

  if (CONTACT.whatsapp) waBtn.hidden = false;
  if (CONTACT.email) mailBtn.hidden = false;
  if (CONTACT.whatsapp || CONTACT.email) note.textContent = 'Send it straight from here, or copy it and message @mavro.kinetic.';

  form.addEventListener('input', function () { build(); status.textContent = ''; });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  build();

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (resolve, reject) {
      out.focus(); out.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ok ? resolve() : reject();
    });
  }

  $('#copy-btn').addEventListener('click', function () {
    var f = form.elements;
    var hasInput = f.name.value.trim() || f.biz.value.trim() || f.when.value.trim() || f.details.value.trim() ||
      form.querySelector('input[name="need"]:checked');
    if (!hasInput) { status.textContent = 'Fill in at least one field first.'; return; }
    copyText(build()).then(function () {
      status.textContent = 'Brief copied. Paste it into a message to @mavro.kinetic.';
    }).catch(function () {
      status.textContent = 'Could not copy. Select the brief text and copy it by hand.';
    });
  });
})();
