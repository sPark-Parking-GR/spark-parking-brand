(function () {
  "use strict";

  var DATA = window.__SPARK__;
  var COPY = DATA.audiences;

  function mailto(subject) {
    return 'mailto:' + DATA.email + '?subject=' + encodeURIComponent(subject);
  }

  var CHECK = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="8.5" fill="var(--blue)"/><path d="M4.8 8.7l2.3 2.3 5-5.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FEAT_ICON = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="1.5" y="1.5" width="19" height="19" rx="6" stroke="var(--blue)" stroke-width="1.6"/><circle cx="11" cy="9.5" r="3" fill="var(--blue)"/><path d="M11 13v4.5" stroke="var(--blue)" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var audience = 'drivers';

  function renderAudience() {
    var sel = COPY[audience];
    var isDrivers = audience === 'drivers';

    $('togDrivers').classList.toggle('active', isDrivers);
    $('togBusiness').classList.toggle('active', !isDrivers);
    $('togDrivers').setAttribute('aria-selected', String(isDrivers));
    $('togBusiness').setAttribute('aria-selected', String(!isDrivers));

    $('heroEyebrow').textContent = sel.eyebrow;
    $('heroHeadline').textContent = sel.headline;
    $('heroSub').textContent = sel.sub;
    $('heroCta1').textContent = sel.cta1;
    $('heroCta2').textContent = sel.cta2;

    var chipsEl = $('heroChips');
    chipsEl.innerHTML = '';
    sel.chips.forEach(function (label) {
      var chip = el('div', 'chip');
      var icon = el('span');
      icon.innerHTML = CHECK;
      chip.appendChild(icon.firstChild);
      chip.appendChild(el('span', null, label));
      chipsEl.appendChild(chip);
    });

    $('phoneMock').style.display = isDrivers ? '' : 'none';
    $('dashMock').style.display = isDrivers ? 'none' : '';

    $('stepsEyebrow').textContent = sel.stepsEyebrow;
    $('stepsTitle').textContent = sel.stepsTitle;
    var stepsGrid = $('stepsGrid');
    stepsGrid.innerHTML = '';
    sel.steps.forEach(function (st) {
      var card = el('div', 'step-card');
      card.appendChild(el('div', 'step-num', st.n));
      card.appendChild(el('h3', null, st.t));
      card.appendChild(el('p', null, st.d));
      stepsGrid.appendChild(card);
    });

    $('featEyebrow').textContent = sel.featEyebrow;
    $('featTitle').textContent = sel.featTitle;
    $('featSub').textContent = sel.featSub;
    var featGrid = $('featuresGrid');
    featGrid.innerHTML = '';
    sel.features.forEach(function (ft) {
      var card = el('div', 'feat-card');
      var icon = el('div', 'feat-icon');
      icon.innerHTML = FEAT_ICON;
      card.appendChild(icon);
      card.appendChild(el('h3', null, ft.t));
      card.appendChild(el('p', null, ft.d));
      featGrid.appendChild(card);
    });

    $('ctaHead').textContent = sel.ctaHead;
    $('ctaSub').textContent = sel.ctaSub;
    $('ctaBtn').textContent = sel.cta1;
    $('navCta').textContent = sel.cta1;

    var primary = mailto(sel.mailSubject);
    $('heroCta1').href = primary;
    $('ctaBtn').href = primary;
    $('navCta').href = primary;
  }

  function setAudience(a) {
    if (!COPY[a] || a === audience) return;
    audience = a;
    renderAudience();
  }

  $('togDrivers').addEventListener('click', function () { setAudience('drivers'); });
  $('togBusiness').addEventListener('click', function () { setAudience('business'); });

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function () { setAudience(link.getAttribute('data-nav')); });
  });

  $('heroCta2').addEventListener('click', function () {
    document.getElementById('how').scrollIntoView({ behavior: 'smooth' });
  });

  var SUN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';

  function effectiveTheme() {
    var t = document.documentElement.dataset.theme;
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateToggleIcon() {
    $('themeToggle').innerHTML = effectiveTheme() === 'dark' ? SUN : MOON;
  }

  updateToggleIcon();

  $('themeToggle').addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('spark-theme', next); } catch (e) {}
    updateToggleIcon();
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (!document.documentElement.dataset.theme) updateToggleIcon(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  renderAudience();
})();
