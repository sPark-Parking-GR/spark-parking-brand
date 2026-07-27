import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SITE, CONTACT_EMAIL, LOCALES, LOCALE_CODES, DEFAULT_LOCALE } from '../src/content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;

const js = await readFile(`${root}src/main.js`, 'utf8');
const css = await readFile(`${root}src/styles.css`, 'utf8');
const robots = await readFile(`${dist}/robots.txt`, 'utf8');
const sitemap = await readFile(`${dist}/sitemap.xml`, 'utf8');

const pages = Object.fromEntries(
  await Promise.all(
    LOCALE_CODES.map(async (code) => [
      code,
      await readFile(`${dist}${LOCALES[code].dir ? `/${LOCALES[code].dir}` : ''}/index.html`, 'utf8')
    ])
  )
);

const meta = (html, name) =>
  (html.match(new RegExp(`<meta (?:name|property)="${name}"[^>]*content="([^"]*)"`)) ?? [])[1];

const forEachLocale = (fn) => {
  for (const code of LOCALE_CODES) fn(code, pages[code], LOCALES[code]);
};

test('every locale emits a page with the right lang attribute', () => {
  forEachLocale((code, html) => {
    assert.match(html, new RegExp(`<html lang="${code}">`), `${code}: wrong or missing lang`);
  });
});

test('canonical, og:url and hreflang form a complete reciprocal set', () => {
  forEachLocale((code, html, locale) => {
    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}${locale.path}">`), `${code}: canonical`);
    assert.equal(meta(html, 'og:url'), `${SITE}${locale.path}`, `${code}: og:url`);
    for (const other of LOCALE_CODES) {
      assert.ok(
        html.includes(`hreflang="${other}" href="${SITE}${LOCALES[other].path}"`),
        `${code}: missing hreflang pointing at ${other}`
      );
    }
    assert.ok(
      html.includes(`hreflang="x-default" href="${SITE}${LOCALES[DEFAULT_LOCALE].path}"`),
      `${code}: missing x-default`
    );
  });
});

test('sitemap lists every locale with its alternates', () => {
  for (const code of LOCALE_CODES) {
    assert.ok(sitemap.includes(`<loc>${SITE}${LOCALES[code].path}</loc>`), `sitemap missing ${code}`);
  }
  assert.ok(robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
  assert.ok(sitemap.includes('hreflang="x-default"'));
});

test('translations are complete — no locale falls back to another', () => {
  const shape = (value, path = '') => {
    if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${path}[${i}]`));
    if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`));
    return [path];
  };
  const reference = shape(LOCALES[DEFAULT_LOCALE]).sort();
  for (const code of LOCALE_CODES) {
    assert.deepEqual(shape(LOCALES[code]).sort(), reference, `${code} has a different content shape`);
  }
});

test('Greek page carries Greek copy, English page carries English copy', () => {
  assert.match(pages.el, /Βρες το φθηνότερο πάρκινγκ/);
  assert.match(pages.el, /Πάρκινγκ σε τρία μόνο βήματα/);
  assert.match(pages.en, /Find the cheapest parking/);
  assert.match(pages.en, /Parking sorted in three taps/);
  assert.doesNotMatch(pages.en, /Βρες το φθηνότερο/, 'English page leaked Greek copy');
  assert.doesNotMatch(pages.el, /Find the cheapest parking/, 'Greek page leaked English copy');
});

test('each page ships only its own locale to the browser', () => {
  forEachLocale((code, html) => {
    const runtime = JSON.parse(html.match(/window\.__SPARK__ = (\{.*?\});<\/script>/s)[1]);
    assert.equal(runtime.locale, code);
    for (const audience of ['drivers', 'business']) {
      assert.ok(runtime.audiences[audience].headline, `${code}: ${audience} headline missing from runtime data`);
    }
  });
});

test('language switcher links to every other locale and marks the current one', () => {
  forEachLocale((code, html, locale) => {
    assert.ok(
      html.includes(`<span class="lang-opt active" aria-current="true">${locale.short}</span>`),
      `${code}: current locale not marked`
    );
    for (const other of LOCALE_CODES.filter((c) => c !== code)) {
      assert.ok(
        html.includes(`href="${LOCALES[other].path}" hreflang="${other}"`),
        `${code}: no switcher link to ${other}`
      );
    }
  });
});

test('relative asset paths resolve from each locale directory', () => {
  forEachLocale((code, html, locale) => {
    const prefix = locale.dir ? '../' : '';
    assert.ok(html.includes(`href="${prefix}styles.css"`), `${code}: stylesheet path`);
    assert.ok(html.includes(`src="${prefix}main.js"`), `${code}: script path`);
    for (const src of html.match(/<img [^>]*src="([^"]+)"/g) ?? []) {
      assert.ok(src.includes(`${prefix}assets/`), `${code}: asset path not relative to locale dir — ${src}`);
    }
  });
});

test('body content is in the HTML, not only built by JS', () => {
  forEachLocale((code, html, locale) => {
    assert.ok(html.includes(locale.drivers.steps[0].d), `${code}: steps missing from static HTML`);
    assert.ok(html.includes(locale.drivers.features[0].d), `${code}: features missing from static HTML`);
    assert.ok(html.includes(locale.drivers.chips[2]), `${code}: hero chips missing from static HTML`);
    for (const id of ['stepsGrid', 'featuresGrid', 'heroChips']) {
      assert.doesNotMatch(html, new RegExp(`id="${id}">\\s*</div>`), `${code}: #${id} is empty`);
    }
  });
});

test('no dead placeholder links remain', () => {
  forEachLocale((code, html) => {
    assert.doesNotMatch(html, /href="#"/, `${code}: dead href="#" left in markup`);
  });
});

test('every contact path uses the one company address', () => {
  forEachLocale((code, html) => {
    const addresses = new Set(
      [...html.matchAll(/href="mailto:([^?"]+)/g)].map((m) => m[1])
    );
    assert.deepEqual([...addresses], [CONTACT_EMAIL], `${code}: unexpected contact address`);
  });
});

test('pages collect no personal information', () => {
  forEachLocale((code, html) => {
    assert.doesNotMatch(html, /<form\b/i, `${code}: form present`);
    assert.doesNotMatch(html, /<input\b/i, `${code}: input present`);
    assert.doesNotMatch(html, /<textarea\b/i, `${code}: textarea present`);
    const externalScripts = html.match(/<script[^>]+src="https?:\/\//gi) ?? [];
    assert.equal(externalScripts.length, 0, `${code}: third-party script`);
  });
});

test('client code transmits nothing and stores only the theme', () => {
  for (const api of ['fetch(', 'XMLHttpRequest', 'navigator.sendBeacon', 'WebSocket']) {
    assert.ok(!js.includes(api), `${api} in main.js — this page must not transmit data`);
  }
  const keys = [...js.matchAll(/localStorage\.\w+\('([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(keys)], ['spark-theme']);
  assert.ok(!js.includes('document.cookie'), 'no cookies');
  assert.ok(!js.includes('sessionStorage'), 'no sessionStorage');
});

test('the company address is shown as readable text', () => {
  forEachLocale((code, html) => {
    assert.ok(html.includes(`class="footer-email"`), `${code}: no footer email element`);
    assert.ok(html.includes(`>${CONTACT_EMAIL}</a>`), `${code}: address not rendered as text`);
  });
});

test('metadata is present and descriptions fit search results', () => {
  forEachLocale((code, html) => {
    for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'twitter:card']) {
      assert.ok(meta(html, tag), `${code}: missing ${tag}`);
    }
    assert.equal(meta(html, 'og:locale'), code);
    const description = meta(html, 'description');
    assert.ok(
      description.length >= 70 && description.length <= 165,
      `${code}: meta description is ${description.length} chars, outside ~70-165`
    );
  });
});

test('social image is absolute and the file exists', async () => {
  for (const code of LOCALE_CODES) {
    for (const tag of ['og:image', 'twitter:image']) {
      const url = meta(pages[code], tag);
      assert.ok(url.startsWith('https://'), `${code}: ${tag} must be absolute`);
      await assert.doesNotReject(access(`${dist}/${url.replace(`${SITE}/`, '')}`), `${code}: ${tag} file missing`);
    }
  }
});

test('exactly one h1 per page, and headings do not skip levels', () => {
  forEachLocale((code, html) => {
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${code}: h1 count`);
    let deepest = 0;
    for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
      assert.ok(Number(level) <= deepest + 1, `${code}: heading jumps to h${level}`);
      deepest = Math.max(deepest, Number(level));
    }
  });
});

test('structured data is valid JSON and localized', () => {
  forEachLocale((code, html) => {
    const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(block, `${code}: missing JSON-LD`);
    const data = JSON.parse(block[1]);
    assert.equal(data['@context'], 'https://schema.org');
    const website = data['@graph'].find((n) => n['@type'] === 'WebSite');
    assert.equal(website.inLanguage, code, `${code}: JSON-LD inLanguage mismatch`);
    for (const node of data['@graph']) {
      for (const url of [node.url, node.logo].filter(Boolean)) {
        assert.ok(url.startsWith(SITE), `${code}: ${url} must use the canonical origin`);
      }
    }
  });
});

test('fonts are self-hosted — no request reaches Google', () => {
  assert.doesNotMatch(css, /@import/, 'importing fonts in CSS delays first paint');
  assert.doesNotMatch(css, /fonts\.(googleapis|gstatic)\.com/, 'stylesheet still references Google Fonts');
  forEachLocale((code, html) => {
    assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/, `${code}: still requests Google Fonts`);
    assert.match(html, /@font-face|assets\/fonts\//, `${code}: no local font reference`);
  });
});

test('every @font-face file exists and is preloaded where it is needed', async () => {
  const referenced = [...css.matchAll(/url\('assets\/fonts\/([^']+)'\)/g)].map((m) => m[1]);
  assert.ok(referenced.length > 0, 'no @font-face rules found');
  for (const file of new Set(referenced)) {
    await assert.doesNotReject(access(`${dist}/assets/fonts/${file}`), `missing font file ${file}`);
  }
  forEachLocale((code, html, locale) => {
    for (const file of locale.fonts) {
      assert.ok(referenced.includes(file), `${code} preloads ${file}, which no @font-face uses`);
      assert.ok(
        html.includes(`href="${locale.dir ? '../' : ''}assets/fonts/${file}" as="font" type="font/woff2" crossorigin`),
        `${code}: ${file} not preloaded correctly`
      );
    }
  });
});

test('brand wordmark is a themeable mask, and the text stays in the DOM', async () => {
  await assert.doesNotReject(access(`${dist}/assets/spark-title.png`), 'wordmark asset missing from build');
  assert.match(css, /@supports \(\(mask-image:.*\) or \(-webkit-mask-image:.*\)\)/, 'mask needs a support guard');
  for (const prop of ['-webkit-mask:', 'mask:']) {
    assert.ok(css.includes(`${prop}url('assets/spark-title.png')`), `missing ${prop} declaration`);
  }
  assert.match(css, /\.nav-brand span \{[^}]*background-color:var\(--wm\)/, 'nav wordmark must follow the theme token');
  assert.match(
    css,
    /\.footer-brand-row span \{[^}]*background-color:var\(--footerInk\)/,
    'footer wordmark must use the footer ink token'
  );
  forEachLocale((code, html) => {
    assert.ok(html.includes('<span>sPark</span>'), `${code}: brand name must remain as text for screen readers`);
    assert.match(
      html,
      /<img src="[^"]*logo-68\.png" alt=""/,
      `${code}: logo must be decorative — the adjacent text already names the brand`
    );
  });
});

test('the dashboard mockup uses the wordmark too', () => {
  forEachLocale((code, html) => {
    const sidebar = html.match(/<img src="[^"]*spark-title\.png"[^>]*>/g) ?? [];
    assert.equal(sidebar.length, 1, `${code}: expected exactly one wordmark <img> (the dashboard mockup)`);
    assert.match(sidebar[0], /width="\d+" height="\d+"/, `${code}: wordmark image needs dimensions`);
    assert.doesNotMatch(html, />sPark<\/div>/, `${code}: dashboard sidebar still renders the brand as text`);
  });
});

test('images inside the initially-hidden dashboard mock are not lazy', () => {
  forEachLocale((code, html) => {
    const mock = html.match(/<div class="dash-mock"[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/section>)/)?.[0] ?? '';
    assert.ok(mock.length > 0, `${code}: could not locate the dashboard mock`);
    for (const tag of mock.match(/<img [^>]*>/g) ?? []) {
      assert.doesNotMatch(
        tag,
        /loading="lazy"/,
        `${code}: lazy image inside a display:none container never loads when JS reveals it — ${tag.slice(0, 60)}`
      );
    }
  });
});

test('visitors never download the full-size mark — it is the social image only', () => {
  forEachLocale((code, html) => {
    for (const tag of html.match(/<img [^>]*>/g) ?? []) {
      assert.doesNotMatch(tag, /spark-mark\.png/, `${code}: inline image still uses the 103 KB original — ${tag.slice(0, 60)}`);
    }
    for (const tag of html.match(/<link rel="(icon|apple-touch-icon)"[^>]*>/g) ?? []) {
      assert.doesNotMatch(tag, /spark-mark\.png/, `${code}: icon still uses the 103 KB original`);
    }
    assert.ok(meta(html, 'og:image').endsWith('spark-mark.png'), `${code}: og:image should stay the full-size mark`);
  });
});

test('every referenced image file exists in the build', async () => {
  for (const code of LOCALE_CODES) {
    const dir = LOCALES[code].dir;
    const refs = [...pages[code].matchAll(/(?:src|href)="((?:\.\.\/)?assets\/[^"]+)"/g)].map((m) => m[1]);
    for (const ref of new Set(refs)) {
      const path = `${dist}/${ref.replace('../', '')}`;
      await assert.doesNotReject(access(path), `${code}: ${ref} missing from build (dir=${dir || '/'})`);
    }
  }
});

test('self-hosted fonts ship with their OFL licenses', async () => {
  for (const family of ['Sora', 'Manrope']) {
    const path = `${dist}/assets/fonts/OFL-${family}.txt`;
    await assert.doesNotReject(access(path), `${family} is self-hosted but its OFL license is missing`);
    const text = await readFile(path, 'utf8');
    assert.match(text, /SIL Open Font License, Version 1\.1/, `${family}: not the OFL text`);
    assert.match(text, /^Copyright/, `${family}: missing copyright notice the OFL requires`);
  }
});

test('Greek pages use a display font that has Greek glyphs', () => {
  assert.match(css, /html\[lang="el"\] \{ --fontDisplay: 'Manrope'/, 'Greek must not fall back to Sora');
  const sora = css.match(/@font-face \{[^}]*'Sora'[\s\S]*?\}/g) ?? [];
  assert.ok(sora.length > 0);
  for (const face of sora) {
    assert.doesNotMatch(face, /greek/, 'Sora ships no Greek subset — it must not claim one');
    assert.doesNotMatch(
      face,
      /U\+03(7[0-9A-F]|[89A-F][0-9A-F])/,
      'Sora has no Greek glyphs — declaring the Greek block would render tofu'
    );
  }
});

test('every image declares intrinsic dimensions to prevent layout shift', () => {
  forEachLocale((code, html) => {
    for (const tag of html.match(/<img [^>]*>/g) ?? []) {
      assert.match(tag, /\bwidth="\d+"/, `${code}: missing width — ${tag.slice(0, 60)}`);
      assert.match(tag, /\bheight="\d+"/, `${code}: missing height — ${tag.slice(0, 60)}`);
    }
  });
});
