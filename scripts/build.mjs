import { cp, rm, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { renderPage, renderLegalPage } from '../src/template.mjs'
import { SITE, LOCALES, LOCALE_CODES, DEFAULT_LOCALE } from '../src/content.mjs'
import { LEGAL_KINDS, legalPath } from '../src/legal.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

await cp(`${root}src/assets`, `${dist}/assets`, { recursive: true })
await cp(`${root}src/styles.css`, `${dist}/styles.css`)
await cp(`${root}src/main.js`, `${dist}/main.js`)

for (const code of LOCALE_CODES) {
  const locale = LOCALES[code]
  const dir = locale.dir ? `${dist}/${locale.dir}` : dist
  if (locale.dir) await mkdir(dir, { recursive: true })
  await writeFile(`${dir}/index.html`, renderPage(code), 'utf8')

  for (const kind of LEGAL_KINDS) {
    await mkdir(`${dir}/${kind}`, { recursive: true })
    await writeFile(`${dir}/${kind}/index.html`, renderLegalPage(code, kind), 'utf8')
  }
}

const alternates = (pathOf) =>
  LOCALE_CODES.map(
    (other) =>
      `    <xhtml:link rel="alternate" hreflang="${other}" href="${SITE}${pathOf(LOCALES[other])}"/>`,
  )
    .concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pathOf(LOCALES[DEFAULT_LOCALE])}"/>`,
    )
    .join('\n')

const entry = (pathOf, locale, changefreq, priority) => `  <url>
    <loc>${SITE}${pathOf(locale)}</loc>
${alternates(pathOf)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`

const home = (locale) => locale.path
const urls = [
  ...LOCALE_CODES.map((code) =>
    entry(home, LOCALES[code], 'weekly', code === DEFAULT_LOCALE ? '1.0' : '0.9'),
  ),
  ...LEGAL_KINDS.flatMap((kind) =>
    LOCALE_CODES.map((code) =>
      entry((locale) => legalPath(locale, kind), LOCALES[code], 'yearly', '0.3'),
    ),
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

await writeFile(`${dist}/sitemap.xml`, sitemap, 'utf8')
await writeFile(
  `${dist}/robots.txt`,
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8',
)

console.log(
  `landing: built dist/ — ${LOCALE_CODES.flatMap((c) => [LOCALES[c].path, ...LEGAL_KINDS.map((k) => legalPath(LOCALES[c], k))]).join(', ')}`,
)
