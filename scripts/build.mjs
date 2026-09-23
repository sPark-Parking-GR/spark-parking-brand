import { cp, rm, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { renderPage } from '../src/template.mjs'
import { SITE, LOCALES, LOCALE_CODES, DEFAULT_LOCALE } from '../src/content.mjs'

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
}

const alternates = (code) =>
  LOCALE_CODES.map(
    (other) =>
      `    <xhtml:link rel="alternate" hreflang="${other}" href="${SITE}${LOCALES[other].path}"/>`,
  )
    .concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${LOCALES[DEFAULT_LOCALE].path}"/>`,
    )
    .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LOCALE_CODES.map(
  (code) => `  <url>
    <loc>${SITE}${LOCALES[code].path}</loc>
${alternates(code)}
    <changefreq>weekly</changefreq>
    <priority>${code === DEFAULT_LOCALE ? '1.0' : '0.9'}</priority>
  </url>`,
).join('\n')}
</urlset>
`

await writeFile(`${dist}/sitemap.xml`, sitemap, 'utf8')
await writeFile(
  `${dist}/robots.txt`,
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8',
)

console.log(`landing: built dist/ — ${LOCALE_CODES.map((c) => LOCALES[c].path).join(', ')}`)
