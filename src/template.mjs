import { SITE, CONTACT_EMAIL, LOCALES, DEFAULT_LOCALE } from './content.mjs';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const mailto = (subject) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

const CHECK =
  '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="8.5" fill="var(--blue)"/><path d="M4.8 8.7l2.3 2.3 5-5.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const FEAT_ICON =
  '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="1.5" y="1.5" width="19" height="19" rx="6" stroke="var(--blue)" stroke-width="1.6"/><circle cx="11" cy="9.5" r="3" fill="var(--blue)"/><path d="M11 13v4.5" stroke="var(--blue)" stroke-width="1.6" stroke-linecap="round"/></svg>';

const asset = (locale, file) => (locale.dir ? `../${file}` : file);

const preloads = (locale) =>
  locale.fonts
    .map(
      (file) =>
        `<link rel="preload" href="${asset(locale, `assets/fonts/${file}`)}" as="font" type="font/woff2" crossorigin>`
    )
    .join('\n');

function head(locale) {
  const t = locale;
  const url = `${SITE}${t.path}`;
  const image = `${SITE}/assets/spark-mark.png`;
  const alternates = Object.values(LOCALES)
    .map((l) => `<link rel="alternate" hreflang="${l.code}" href="${SITE}${l.path}">`)
    .join('\n');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'sPark',
        url: `${SITE}/`,
        logo: image,
        slogan: t.footer.tag,
        email: CONTACT_EMAIL,
        areaServed: { '@type': 'Country', name: 'Greece' }
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'sPark',
        description: t.meta.siteDescription,
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: t.code
      },
      {
        '@type': 'MobileApplication',
        name: 'sPark',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'iOS, Android',
        url: `${SITE}/`,
        publisher: { '@id': `${SITE}/#organization` },
        description: t.meta.appDescription
      }
    ]
  };

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<link rel="canonical" href="${url}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE}${LOCALES[DEFAULT_LOCALE].path}">
<meta name="theme-color" content="#F4F0E8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#020C14" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="sPark">
<meta property="og:locale" content="${t.code}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.ogDescription)}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="329">
<meta property="og:image:height" content="435">
<meta property="og:image:alt" content="${esc(t.meta.imageAlt)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(t.meta.title)}">
<meta name="twitter:description" content="${esc(t.meta.ogDescription)}">
<meta name="twitter:image" content="${image}">
${preloads(t)}
<link rel="stylesheet" href="${asset(t, 'styles.css')}">
<link rel="icon" href="${asset(t, 'assets/logo-68.png')}">
<link rel="apple-touch-icon" href="${asset(t, 'assets/icon-180.png')}">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
<script>
  try {
    var stored = localStorage.getItem('spark-theme');
    if (stored === 'dark' || stored === 'light') document.documentElement.dataset.theme = stored;
  } catch (e) {}
</script>`;
}

function langSwitch(locale) {
  return Object.values(LOCALES)
    .map((l) =>
      l.code === locale.code
        ? `<span class="lang-opt active" aria-current="true">${l.short}</span>`
        : `<a class="lang-opt" href="${l.path}" hreflang="${l.code}" lang="${l.code}">${l.short}</a>`
    )
    .join('');
}

const chips = (list) =>
  list.map((c) => `<div class="chip">${CHECK}<span>${esc(c)}</span></div>`).join('\n          ');

const steps = (list) =>
  list
    .map(
      (s) =>
        `<div class="step-card"><div class="step-num">${esc(s.n)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`
    )
    .join('\n        ');

const features = (list) =>
  list
    .map(
      (f) =>
        `<div class="feat-card"><div class="feat-icon">${FEAT_ICON}</div><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></div>`
    )
    .join('\n        ');

const pricing = (t) =>
  t.pricing.plans
    .map(
      (p) => `<div class="price-card${p.popular ? ' popular' : ''}">
          ${p.popular ? `<div class="price-badge">${esc(t.pricing.badge)}</div>` : ''}
          <div class="price-name">${esc(p.name)}</div>
          <div class="price-amt"><span class="big${p.amount.length > 8 ? ' is-long' : ''}">${esc(p.amount)}</span>${p.per ? `<span class="per">${esc(p.per)}</span>` : ''}</div>
          <p class="price-desc">${esc(p.desc)}</p>
          <div class="price-feats">
            ${p.feats.map((f) => `<div>${CHECK}<span>${esc(f)}</span></div>`).join('\n            ')}
          </div>
          <a class="${p.popular ? 'price-btn-fill' : 'price-btn-outline'}" href="${mailto(p.mailSubject)}">${esc(p.cta)}</a>
        </div>`
    )
    .join('\n        ');

function phoneMock(t) {
  const p = t.phone;
  return `<div class="phone-mock" id="phoneMock" aria-hidden="true">
          <div style="position:relative;border-radius:36px;overflow:hidden;height:604px;background:var(--pMap)">
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 32px,var(--pMapLine) 32px 33px),repeating-linear-gradient(90deg,transparent 0 32px,var(--pMapLine) 32px 33px)"></div>
            <div style="position:absolute;top:-60px;left:150px;width:30px;height:760px;background:var(--pRoad);transform:rotate(22deg)"></div>
            <div style="position:absolute;top:120px;left:-90px;width:520px;height:22px;background:var(--pRoad);transform:rotate(-9deg)"></div>
            <div style="position:absolute;top:300px;left:60px;width:26px;height:520px;background:var(--pRoad);opacity:0.7;transform:rotate(-14deg)"></div>
            <img src="${asset(t, 'assets/logo-68.png')}" alt="" width="26" height="34" decoding="async" style="position:absolute;top:118px;left:72px;width:26px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5))"/>
            <img src="${asset(t, 'assets/logo-68.png')}" alt="" width="26" height="34" decoding="async" style="position:absolute;top:148px;left:112px;width:26px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5))"/>
            <img src="${asset(t, 'assets/logo-68.png')}" alt="" width="24" height="32" decoding="async" style="position:absolute;top:206px;left:198px;width:24px;opacity:0.5;filter:grayscale(1) drop-shadow(0 3px 6px rgba(0,0,0,0.5))"/>
            <div style="position:absolute;top:278px;left:120px;width:16px;height:16px;border-radius:999px;background:var(--pAccent);border:3px solid var(--pMap);box-shadow:0 0 0 4px rgba(36,158,217,0.25)"></div>
            <div style="position:absolute;right:14px;bottom:300px;width:42px;height:42px;border-radius:999px;background:var(--pRecenter);border:1px solid var(--pRecenterBorder);display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="4" stroke="var(--pAccent)" stroke-width="1.6"/><path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="var(--pAccent)" stroke-width="1.6" stroke-linecap="round"/></svg></div>
            <div style="position:absolute;left:0;right:0;bottom:0;background:var(--pSheet);border-top-left-radius:26px;border-top-right-radius:26px;padding:12px 15px 18px;box-shadow:0 -16px 40px rgba(0,0,0,0.22)">
              <div style="width:40px;height:4px;border-radius:2px;background:var(--pHandle);opacity:0.4;margin:0 auto 12px"></div>
              <div style="display:flex;align-items:center;margin-bottom:12px"><span style="font-family:var(--fontDisplay);font-weight:700;font-size:15px;color:var(--pInk)">${esc(p.areas)}</span><span style="margin-left:auto;font-size:12px;color:var(--pMuted)">${esc(p.swipe)}</span></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
                <div style="display:flex;align-items:center;justify-content:center;gap:7px;height:42px;border-radius:12px;background:linear-gradient(180deg,var(--blue),var(--blue2));color:#fff;font-weight:700;font-size:13px"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="4" cy="4" r="1.9" stroke="#fff" stroke-width="1.3"/><circle cx="11" cy="11" r="1.9" stroke="#fff" stroke-width="1.3"/><path d="M5.5 4H9a2 2 0 012 2v3.5" stroke="#fff" stroke-width="1.3"/></svg>${esc(p.nearby)}</div>
                <div style="display:flex;align-items:center;justify-content:center;gap:7px;height:42px;border-radius:12px;background:var(--pSeg);color:var(--pMuted);font-weight:700;font-size:13px;border:1px solid var(--pSegBorder)"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.6" y="4" width="11.8" height="7" rx="1.6" stroke="currentColor" stroke-width="1.2"/><circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" stroke-width="1.2"/></svg>${esc(p.cheapest)}</div>
              </div>
              <div style="padding:12px;border-radius:14px;background:var(--pCard);border:1px solid var(--pCardActive);margin-bottom:9px">
                <div style="display:flex;align-items:flex-start"><div style="min-width:0"><div style="font-family:var(--fontDisplay);font-weight:700;font-size:14px;color:var(--pInk)">${esc(p.spotA)}</div><div style="font-size:11px;color:var(--pMuted);margin-top:2px">${esc(p.spotASub)}</div></div><div style="margin-left:auto;text-align:right;flex:none;padding-left:10px"><div style="font-size:16px;font-weight:800;color:var(--pPrice)">€0.50</div><div style="font-size:10px;color:var(--pMuted)">${esc(p.total)}</div></div></div>
                <div style="display:flex;align-items:center;gap:9px;margin-top:9px"><span style="padding:3px 9px;border-radius:999px;font-size:10px;font-weight:800;color:var(--pAvail);background:var(--pAvailBg)">${esc(p.available)}</span><span style="font-size:11px;color:var(--pMuted)">3.6 km</span></div>
              </div>
              <div style="padding:12px;border-radius:14px;background:var(--pCard);border:1px solid var(--pCardBorder)">
                <div style="display:flex;align-items:flex-start"><div><div style="font-family:var(--fontDisplay);font-weight:700;font-size:14px;color:var(--pInk)">${esc(p.spotB)}</div><div style="font-size:11px;color:var(--pMuted);margin-top:2px">${esc(p.spotBSub)}</div></div><div style="margin-left:auto;text-align:right;padding-left:10px"><div style="font-size:16px;font-weight:800;color:var(--pPrice)">—</div><div style="font-size:10px;color:var(--pMuted)">${esc(p.total)}</div></div></div>
                <div style="display:flex;align-items:center;gap:9px;margin-top:9px"><span style="padding:3px 9px;border-radius:999px;font-size:10px;font-weight:800;color:var(--pFull);background:var(--pFullBg)">${esc(p.full)}</span><span style="font-size:11px;color:var(--pMuted)">1.7 km</span></div>
              </div>
            </div>
          </div>
        </div>`;
}

const DASH_ICONS = [
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12.5V4l4-2.5V12.5M6 12.5V6l6 2.5v4" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M1 12.5h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.2 1.5H12.5V6.8L6.8 12.5 1.5 7.2 7.2 1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><circle cx="9.7" cy="4.3" r="1" fill="currentColor"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M1.5 5.5h11M4.5 1.2v2.4M9.5 1.2v2.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.3" r="2.3" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 12c0-2.3 2-4 4.5-4s4.5 1.7 4.5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 12.5h11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="2.5" y="7" width="2.4" height="4" fill="currentColor"/><rect x="5.8" y="4.5" width="2.4" height="6.5" fill="currentColor"/><rect x="9.1" y="2" width="2.4" height="9" fill="currentColor"/></svg>',
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2.5h8M3 5.5h8M3 8.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="1" y="10.5" width="3" height="2.4" rx="0.6" stroke="currentColor" stroke-width="1.1"/></svg>'
];

function dashMock(t) {
  const d = t.dash;
  const nav = d.nav
    .map((label, i) =>
      i === 0
        ? `<div style="display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,0.09);color:#fff;font-size:12px;font-weight:700">${DASH_ICONS[i]}${esc(label)}</div>`
        : `<div style="display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;color:#8CA0B2;font-size:12px;font-weight:600">${DASH_ICONS[i]}${esc(label)}</div>`
    )
    .join('\n              ');

  return `<div class="dash-mock" id="dashMock" style="display:none" aria-hidden="true">
          <div style="height:38px;display:flex;align-items:center;gap:7px;padding:0 14px;background:var(--dChrome);border-bottom:1px solid var(--dChromeBorder)">
            <div style="width:11px;height:11px;border-radius:999px;background:#E8695D"></div>
            <div style="width:11px;height:11px;border-radius:999px;background:#E6B24C"></div>
            <div style="width:11px;height:11px;border-radius:999px;background:#54B968"></div>
          </div>
          <div style="display:grid;grid-template-columns:140px 1fr">
            <div style="background:linear-gradient(180deg,#0C1B2A,#08121D);padding:15px 11px;display:flex;flex-direction:column;gap:2px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:15px;padding:0 4px"><img src="${asset(t, 'assets/logo-68.png')}" alt="" width="17" height="22" decoding="async" style="height:22px"/><div><img src="${asset(t, 'assets/spark-title.png')}" alt="" width="63" height="15" decoding="async" style="display:block"/><div style="font-size:8px;font-weight:700;letter-spacing:0.18em;color:#5E7185;margin-top:1px">ADMIN</div></div></div>
              ${nav}
            </div>
            <div style="background:var(--dMain)">
              <div style="display:flex;align-items:center;padding:13px 18px;border-bottom:1px solid var(--dHeadBorder)"><span style="font-family:var(--fontDisplay);font-weight:700;font-size:14px;color:var(--dInk)">${esc(d.title)}</span><div style="margin-left:auto;display:flex;align-items:center;gap:9px"><div style="text-align:right"><div style="font-size:11px;font-weight:700;color:var(--dInk);line-height:1.2">${esc(d.userName)}</div><div style="font-size:9px;color:var(--dMuted)">${esc(d.userRole)}</div></div><div style="width:28px;height:28px;border-radius:999px;background:linear-gradient(180deg,#249ED9,#0D80B6);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center">PA</div></div></div>
              <div style="padding:18px">
                <div style="font-family:var(--fontDisplay);font-weight:800;font-size:23px;color:var(--dInk);margin-bottom:3px">${esc(d.overview)}</div>
                <div style="font-size:12px;color:var(--dMuted);margin-bottom:16px">${esc(d.snapshot)}</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:14px">
                  <div style="padding:13px;border-radius:12px;background:var(--dCard);border:1px solid var(--dCardBorder);box-shadow:var(--dCardShadow)">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:11px"><div style="width:30px;height:30px;border-radius:8px;background:rgba(30,136,199,0.14);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 13.5V4.5l5-3v12M7.5 13.5V7l6 3v3.5" stroke="#2AA3DE" stroke-width="1.3" stroke-linejoin="round"/></svg></div><span style="font-size:11px;font-weight:600;color:var(--dMuted)">${esc(d.facilities)}</span></div>
                    <div style="font-family:var(--fontDisplay);font-weight:800;font-size:22px;color:var(--dInk)">12</div>
                  </div>
                  <div style="padding:13px;border-radius:12px;background:var(--dCard);border:1px solid var(--dCardBorder);box-shadow:var(--dCardShadow)">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:11px"><div style="width:30px;height:30px;border-radius:8px;background:rgba(31,157,85,0.16);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.6" stroke="#28B265" stroke-width="1.3"/><path d="M2 6.5h12M5.5 1.5v2.6M10.5 1.5v2.6" stroke="#28B265" stroke-width="1.3" stroke-linecap="round"/></svg></div><span style="font-size:11px;font-weight:600;color:var(--dMuted)">${esc(d.bookings)}</span></div>
                    <div style="font-family:var(--fontDisplay);font-weight:800;font-size:22px;color:var(--dInk)">47</div>
                  </div>
                  <div style="padding:13px;border-radius:12px;background:var(--dCard);border:1px solid var(--dCardBorder);box-shadow:var(--dCardShadow)">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:11px"><div style="width:30px;height:30px;border-radius:8px;background:rgba(217,137,40,0.18);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.6" stroke="#E0982F" stroke-width="1.3"/><path d="M2 7h12" stroke="#E0982F" stroke-width="1.3"/><circle cx="11" cy="10" r="1" fill="#E0982F"/></svg></div><span style="font-size:11px;font-weight:600;color:var(--dMuted)">${esc(d.revenue)}</span></div>
                    <div style="font-family:var(--fontDisplay);font-weight:800;font-size:22px;color:var(--dInk)">€1,284</div>
                  </div>
                </div>
                <div style="padding:15px;border-radius:12px;background:var(--dCard);border:1px solid var(--dCardBorder);box-shadow:var(--dCardShadow)">
                  <div style="display:flex;align-items:center;margin-bottom:13px"><span style="font-family:var(--fontDisplay);font-weight:700;font-size:12px;color:var(--dInk)">${esc(d.chart)}</span><span style="margin-left:auto;font-size:11px;font-weight:700;color:#28B265">+18%</span></div>
                  <div style="display:flex;align-items:flex-end;gap:9px;height:52px">
                    <div style="flex:1;height:42%;border-radius:4px 4px 0 0;background:var(--dChartTrack)"></div>
                    <div style="flex:1;height:58%;border-radius:4px 4px 0 0;background:var(--dChartTrack)"></div>
                    <div style="flex:1;height:48%;border-radius:4px 4px 0 0;background:var(--dChartTrack)"></div>
                    <div style="flex:1;height:72%;border-radius:4px 4px 0 0;background:var(--dChartTrack)"></div>
                    <div style="flex:1;height:62%;border-radius:4px 4px 0 0;background:var(--dChartTrack)"></div>
                    <div style="flex:1;height:84%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#249ED9,#0D80B6)"></div>
                    <div style="flex:1;height:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#249ED9,#0D80B6)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
}

export function renderPage(code) {
  const t = LOCALES[code];
  const d = t.drivers;

  const runtime = {
    locale: t.code,
    email: CONTACT_EMAIL,
    generalSubject: t.footer.generalSubject,
    audiences: {
      drivers: { ...t.drivers },
      business: { ...t.business }
    },
    pricingVisibleFor: 'business'
  };

  return `<!DOCTYPE html>
<html lang="${t.code}">
<head>
${head(t)}
</head>
<body>
<div class="shell">

  <header class="nav">
    <div class="nav-brand">
      <img src="${asset(t, 'assets/logo-68.png')}" alt="" width="24" height="32" decoding="async"/>
      <span>sPark</span>
    </div>
    <div class="nav-right">
      <nav class="nav-links">
        <a href="#how" data-nav="drivers">${esc(t.nav.drivers)}</a>
        <a href="#how" data-nav="business">${esc(t.nav.business)}</a>
        <a href="#pricing" data-nav="business">${esc(t.nav.pricing)}</a>
      </nav>
      <div class="lang-switch" role="group" aria-label="${esc(t.langLabel)}">${langSwitch(t)}</div>
      <button class="theme-toggle" id="themeToggle" aria-label="${esc(t.themeToggle)}" title="${esc(t.themeToggle)}"></button>
      <a class="btn-primary" id="navCta" href="${mailto(d.mailSubject)}">${esc(d.cta1)}</a>
    </div>
  </header>

  <section class="hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-inner">
      <div>
        <div class="aud-toggle" role="tablist" aria-label="${esc(t.audience.label)}">
          <button id="togDrivers" class="active" role="tab" aria-selected="true" data-aud="drivers">${esc(t.audience.drivers)}</button>
          <button id="togBusiness" role="tab" aria-selected="false" data-aud="business">${esc(t.audience.business)}</button>
        </div>
        <div class="eyebrow" id="heroEyebrow">${esc(d.eyebrow)}</div>
        <h1 id="heroHeadline">${esc(d.headline)}</h1>
        <p class="hero-sub" id="heroSub">${esc(d.sub)}</p>
        <div class="hero-ctas">
          <a class="hero-cta1" id="heroCta1" href="${mailto(d.mailSubject)}">${esc(d.cta1)}</a>
          <button class="hero-cta2" id="heroCta2">${esc(d.cta2)}</button>
        </div>
        <div class="hero-chips" id="heroChips">
          ${chips(d.chips)}
        </div>
      </div>

      <div class="hero-visual">
        ${phoneMock(t)}

        ${dashMock(t)}
      </div>
    </div>
  </section>

  <section class="section section--alt" id="how">
    <div class="container">
      <div class="sec-intro">
        <div class="sec-eyebrow" id="stepsEyebrow">${esc(d.stepsEyebrow)}</div>
        <h2 class="sec-title" id="stepsTitle">${esc(d.stepsTitle)}</h2>
      </div>
      <div class="steps-grid" id="stepsGrid">
        ${steps(d.steps)}
      </div>
    </div>
  </section>

  <section class="section" id="features">
    <div class="container">
      <div class="sec-intro">
        <div class="sec-eyebrow" id="featEyebrow">${esc(d.featEyebrow)}</div>
        <h2 class="sec-title" id="featTitle" style="margin-bottom:12px">${esc(d.featTitle)}</h2>
        <p class="sec-sub" id="featSub">${esc(d.featSub)}</p>
      </div>
      <div class="features-grid" id="featuresGrid">
        ${features(d.features)}
      </div>
    </div>
  </section>

  <section class="section section--alt" id="pricing" style="display:none">
    <div class="container">
      <div class="price-intro">
        <div class="sec-eyebrow">${esc(t.pricing.eyebrow)}</div>
        <h2 class="sec-title" style="margin-bottom:12px">${esc(t.pricing.title)}</h2>
        <p class="sec-sub">${esc(t.pricing.sub)}</p>
      </div>
      <div class="pricing-grid">
        ${pricing(t)}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="cta-band">
      <div class="cta-band-bg"></div>
      <div class="cta-row">
        <div class="cta-copy">
          <h2 id="ctaHead">${esc(d.ctaHead)}</h2>
          <p id="ctaSub">${esc(d.ctaSub)}</p>
        </div>
        <a class="cta-btn" id="ctaBtn" href="${mailto(d.mailSubject)}">${esc(d.cta1)}</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-grid">
      <div>
        <div class="footer-brand-row"><img src="${asset(t, 'assets/logo-68.png')}" alt="" width="23" height="30" loading="lazy" decoding="async"/><span>sPark</span></div>
        <p class="footer-tag">${esc(t.footer.tag)}</p>
        <p class="footer-desc">${esc(t.footer.desc)}</p>
      </div>
      <div>
        <div class="footer-col-title">${esc(t.footer.driversTitle)}</div>
        <div class="footer-links"><a href="${mailto(t.drivers.mailSubject)}" data-nav="drivers">${esc(t.footer.driversLinks[0])}</a><a href="#how" data-nav="drivers">${esc(t.footer.driversLinks[1])}</a><a href="#features" data-nav="drivers">${esc(t.footer.driversLinks[2])}</a></div>
      </div>
      <div>
        <div class="footer-col-title">${esc(t.footer.businessTitle)}</div>
        <div class="footer-links"><a href="#how" data-nav="business">${esc(t.footer.businessLinks[0])}</a><a href="#pricing" data-nav="business">${esc(t.footer.businessLinks[1])}</a><a href="${mailto(t.business.mailSubject)}" data-nav="business">${esc(t.footer.businessLinks[2])}</a></div>
      </div>
      <div>
        <div class="footer-col-title">${esc(t.footer.contactTitle)}</div>
        <div class="footer-links">
          <a class="footer-email" href="${mailto(t.footer.generalSubject)}">${CONTACT_EMAIL}</a>
          <span class="footer-note">${esc(t.footer.contactNote)}</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${esc(t.footer.rights)}</span>
      <span>${esc(t.footer.place)}</span>
    </div>
  </footer>

</div>
<script>window.__SPARK__ = ${JSON.stringify(runtime)};</script>
<script src="${asset(t, 'main.js')}"></script>
</body>
</html>
`;
}
