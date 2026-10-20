import { SITE, LOCALE_CODES, LOCALES } from '../src/content.mjs'
import { LEGAL_KINDS, legalPath } from '../src/legal.mjs'

const FORBIDDEN = [
  ['cloudflareinsights.com', 'Cloudflare Web Analytics beacon'],
  ['cdn-cgi/challenge-platform', 'Cloudflare JavaScript Detections'],
  ['cdn-cgi/l/email-protection', 'Cloudflare email address obfuscation'],
  ['cdn-cgi/scripts', 'Cloudflare injected script'],
]

const paths = LOCALE_CODES.flatMap((code) => [
  LOCALES[code].path,
  ...LEGAL_KINDS.map((kind) => legalPath(LOCALES[code], kind)),
])

let failed = false
for (const path of paths) {
  const response = await fetch(`${SITE}${path}`)
  const html = await response.text()
  const problems = FORBIDDEN.filter(([needle]) => html.includes(needle)).map(([, label]) => label)
  if (response.headers.get('set-cookie')) problems.push('Set-Cookie header')
  if (response.status !== 200) problems.push(`HTTP ${response.status}`)

  if (problems.length > 0) failed = true
  console.log(
    `${problems.length > 0 ? 'FAIL' : 'ok  '} ${path}${problems.length > 0 ? ` — ${problems.join(', ')}` : ''}`,
  )
}

process.exit(failed ? 1 : 0)
