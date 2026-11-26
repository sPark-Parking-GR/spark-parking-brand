# @spark/landing

Marketing / brand page for the sPark platform. Static HTML, CSS and vanilla JS — no framework, no runtime dependencies. A ~150-line Node build renders one fully static page per language.

Source of truth: `mockups/landing.html`.

## Structure

```
src/
  content.mjs    — all copy for every locale, plus SITE and CONTACT_EMAIL
  template.mjs   — renders a complete HTML page for one locale
  styles.css     — theme tokens + landing styles
  main.js        — audience toggle + theme toggle (browser)
  assets/        — brand mark
scripts/
  build.mjs      — renders every locale into dist/, emits robots.txt + sitemap.xml
  serve.mjs      — zero-dep static server
  dev.mjs        — build, then serve
  smoke.test.mjs — asserts the built output
dist/            — generated, gitignored
```

`src/content.mjs` is the only file to touch for copy changes. Editing markup means editing `template.mjs`, which both locales share — so the two pages cannot drift.

## Languages

| Locale  | URL    | Notes                       |
| ------- | ------ | --------------------------- |
| Greek   | `/`    | Default, `x-default` target |
| English | `/en/` |                             |

Both are **real pre-rendered pages**, not a client-side string swap: correct `lang`, localized `<title>`/meta/JSON-LD, and a reciprocal `hreflang` set. Each page ships only its own locale's copy to the browser, via a `window.__SPARK__` blob the audience toggle reads. The switcher in the header is a plain link, so it works without JS.

Adding a language is one entry in `LOCALES` — build, sitemap, `hreflang`, and the switcher all derive from it. A test compares the key shape of every locale against the default and fails on any missing translation.

## Legal pages

`/privacy/`, `/terms/`, `/en/privacy/` and `/en/terms/` are real pre-rendered pages, built from `src/legal.mjs` (document text, per locale) and `renderLegalPage` in `template.mjs`. Both are linked from every footer and listed in the sitemap with reciprocal `hreflang`. They exist for Google / Apple / Meta sign-in verification and cover the mobile app and the web portal.

Edit the text in `src/legal.mjs` only; the schema is documented at the top of `LEGAL`. Company identity, `PRIVACY_EMAIL` and the log/audit retention periods are declared in `src/content.mjs` and injected as `{{TOKENS}}` (see `tokensFor` in `legal.mjs`), so the text never hard-codes them. The retention numbers are promises made to users: change them only together with the infrastructure that enforces them. `reference/legal-content-prompt.md` is the brief for an LLM to write the full text.

## Images

`spark-mark.png` (329×435, 103 KB) is now **only** the social card image — never served to visitors. Inline use is `logo-68.png` (51×68, 4.3 KB, covers 2× on every placement) and `icon-180.png` (136×180, 17 KB) for `apple-touch-icon`. Both were resized from the original with high-quality bicubic resampling, alpha preserved. A test fails if any `<img>` or icon link reaches for the full-size file again.

### Brand wordmark

The "sPark" next to the logo in the header and footer renders from `spark-title.png` (302×72, copied from `apps/web/public/sPark_title.png`), not from live text.

The artwork is a single cream colour, which would be invisible on the light theme's cream background. So it is applied as a **CSS mask** rather than an `<img>`: the element is filled with `var(--wm)` (navy on light, cream on dark) and the PNG's alpha channel cuts the letterforms out of it. One asset, correct colour in every theme, and the header lockup still recolours with the tokens exactly as the text did.

The `<span>sPark</span>` stays in the markup — the text is pushed off-screen with `text-indent`, so screen readers and crawlers still read the brand name. The adjacent logo `<img>` was switched to `alt=""` so assistive tech does not announce "sPark" twice. The whole block sits behind an `@supports` guard, so a browser without mask support simply keeps the styled text.

The dashboard mockup's sidebar uses the same wordmark, but as a plain `<img>` rather than a mask — that sidebar is a fixed dark gradient in both themes, so the cream artwork needs no recolouring.

Images inside the dashboard mock must **not** carry `loading="lazy"`. The mock starts at `display:none` and is revealed by JS, and Chrome never fires the lazy load for an image that was in a hidden subtree at parse time — it stays blank indefinitely. A test enforces this.

## Fonts

Self-hosted from `src/assets/fonts` — **nothing is requested from Google**, so no visitor IP reaches a third party and there is no consent question. Both families are variable fonts, so one file per subset covers every weight: 5 files, 85 KB total, each with `font-display: swap` and a `unicode-range` so a browser downloads only the subsets the page actually uses.

**Sora has no Greek glyphs** (latin and latin-ext only). Headings therefore resolve through `--fontDisplay`, which is Sora on English pages and Manrope — which does ship Greek — on Greek pages. Before this, Greek headings silently fell back to whatever system font the visitor had.

Each locale preloads only what it needs above the fold, declared in its `LOCALES` entry:

| Page     | Preloads                         | Actually downloads                                                            |
| -------- | -------------------------------- | ----------------------------------------------------------------------------- |
| `/` (el) | `manrope-latin`, `manrope-greek` | those two — Sora is never fetched                                             |
| `/en/`   | `manrope-latin`, `sora-latin`    | those two, plus `manrope-greek` for the Greek place names in the phone mockup |

Both families are SIL Open Font License 1.1; `OFL-Sora.txt` and `OFL-Manrope.txt` ship next to the font files as the license requires, and a test fails if they go missing.

To refresh or add a weight, download from Google Fonts with a modern browser user agent (the CSS returns `woff2` only for those), then dedupe: the same variable file is served for every weight of a family.

## Edge injection check

The site is served through Cloudflare, which can inject its own scripts into the HTML after the build (Web Analytics beacon, JavaScript Detections, email address obfuscation) and set cookies. Any of these contradicts the privacy policy (which declares Umami Cloud as the only analytics and no cookies), and none of them exists in `dist/`, so the build tests cannot see them. After every deploy run `pnpm run check:live`; it fetches the live pages and fails if any of them shows up. Turnstile is not one of these: it is loaded by `main.js` on demand from `challenges.cloudflare.com` and disclosed in the privacy policy, whereas JavaScript Detections (`cdn-cgi/challenge-platform`) is injected into every page by Cloudflare's Bot Fight Mode and is not.

## Behaviour

- **Audience toggle** — swaps hero copy, hero mockup (phone ↔ dashboard), steps, features, CTA band and the interest form's mode. Nav and footer links also switch audience, and the form's own drivers/businesses switch drives the whole page.
- **Interest form** — see [Interest form](#interest-form--the-one-place-the-site-collects-personal-data). Every CTA links to `#interest`.
- **Theme** — follows the OS by default; the toggle sets a `data-theme` override persisted in `localStorage` under `spark-theme`. An inline head script applies it before paint, so there is no flash.

## Analytics

Traffic statistics come from [Umami Cloud](https://umami.is), loaded by a single deferred script in the shared `head()` in `src/template.mjs` (so every page and locale carries it). The script URL and public website ID live in the `UMAMI` constant at the top of that file. The website ID is public by design, not a secret.

Umami sets no cookies, so no consent banner is needed. The privacy policies (`src/legal.mjs`, both locales) disclose it, and the smoke tests allow exactly this one external script (`https://cloud.umami.is/script.js`) and nothing else. If you change provider or add another script, update the tests and the privacy policy together. If the host ever sends a Content-Security-Policy, it must allow `cloud.umami.is` in `script-src` and `connect-src`, `challenges.cloudflare.com` in `script-src` and `frame-src` (Turnstile), and `n8n.sparkparking.gr` in `connect-src` (the form endpoint).

## Interest form — the one place the site collects personal data

Until November 2026 this site collected no personal data at all. That rule was changed on purpose: the home page now has **one** interest form (drivers join the waitlist, businesses request a demo), and nothing else on the site may collect data. The privacy policy (`src/legal.mjs`, section `interest-form`, privacy version `1.1`) describes it, and must change together with it.

How it works:

- The form is server-rendered in `template.mjs`; its copy lives under `interest` in `src/content.mjs` for every locale. The endpoint, the public Turnstile site key and the Turnstile script URL are the `INTEREST` constant in `content.mjs`. They are public by design; the Turnstile **secret** lives only on the n8n server.
- `main.js` posts the form as JSON, once, with `credentials: 'omit'`, to the n8n webhook (`https://n8n.sparkparking.gr/webhook/spark-interest`). The workflow that receives it is `docs/n8n/spark-interest.workflow.json` in the umbrella repo, specified in `docs/interest-forms.md`.
- **Cloudflare Turnstile** loads only when a visitor focuses a form field, never with the page. That is what the privacy policy promises, so keep it that way.
- The submit button is rendered `disabled` and enabled by `main.js`. Without JavaScript the form cannot submit, so field values can never end up in a URL; a `<noscript>` note offers the company email instead.
- Consent is a required checkbox linking to the privacy policy of the same locale. Each submission also sends the current privacy version, which the workflow stores with the lead.

The only client-side storage is still `localStorage['spark-theme']`. The site sets no cookies of its own.

`scripts/smoke.test.mjs` enforces the boundaries: exactly one form with a fixed list of fields and no `action`/`formaction`; consent required; submit disabled in the static HTML; exactly one `fetch()`, aimed at the configured endpoint; no hard-coded URL in `main.js`; no `XMLHttpRequest`, `sendBeacon`, `WebSocket`, cookies or other storage; Turnstile never in the page markup; legal pages still free of any input; and the policy section present in every locale. **Do not relax those tests without an explicit decision to change the policy.**

## Commands

```bash
pnpm run dev           # build, then serve locally
pnpm run build         # emits dist/
pnpm run start         # serves dist/
pnpm run test          # markup/copy smoke tests (run after build)
pnpm run format:check  # Prettier
pnpm run check:live    # inspect the deployed pages (run after every deploy)
```

`PORT` env var overrides the port.

## Deploy

`dist/` is a plain static directory — drop it on any static host. `/en/` is a real directory with its own `index.html`, so no rewrite rules are needed.

| Host                                | Setting                               |
| ----------------------------------- | ------------------------------------- |
| Vercel / Netlify / Cloudflare Pages | build `pnpm run build`, output `dist` |
| S3 / nginx / GitHub Pages           | upload `dist`                         |

CI (`.github/workflows/ci.yml`) runs format check, build and tests on every pull request; it does not deploy.

## SEO

Canonical origin is `SITE` in `src/content.mjs`; canonical tags, `og:url`, `hreflang`, `robots.txt` and `sitemap.xml` all derive from it, so there is one place to change the domain.

The drivers view of every section — hero, chips, steps, features — is **static HTML in both languages**. JS only swaps it when the audience toggle is used. Crawlers and no-JS visitors get the whole page; the JS render is idempotent, so nothing duplicates on load.

Structured data is a JSON-LD `@graph` (Organization + WebSite + MobileApplication). It contains no ratings, review counts, or install figures — those would be fabricated, and fabricated structured data is a manual-action risk.

## Fidelity to the mockup

Computed styles were diffed against `mockups/landing.html` rendered side by side at 1280px. Every checked property — font sizes, weights, line heights, letter spacing, colors, radii, padding, shadows, gradients, element box sizes — matches on both locales. The English dashboard mock measures `534x418`, identical to the mockup.

Two intentional deviations:

- Greek headings use Manrope, because Sora has no Greek glyphs (see Fonts).
- Six CSS custom properties in the mockup (`--screen`, `--sline`, `--road`, `--sheet`, `--cardShadow`, `--radius`) are **not** carried over. They are declared in the mockup but never referenced by any rule — dead tokens.

Pre-existing behaviour worth knowing: below ~570px the dashboard mock keeps its 534px width and is clipped on the right by `.shell { overflow-x: hidden }`. The mockup does exactly the same, so this was inherited, not introduced. The page never scrolls horizontally.

## Known gaps

- **Social image is the square brand mark (329×435).** Cards are declared `twitter:card=summary` to match. A designed 1200×630 asset would allow `summary_large_image`, which has materially better click-through. Add it as `assets/og-cover.png`, then update the four image tags and the card type.
- Below ~570px the dashboard mock is clipped rather than scaled (inherited from the mockup — see Fidelity above). Making it scale would mean a transform or a mobile-specific variant.
- **Greek copy has not been reviewed by a native speaker.** It reads naturally and uses the informal second person throughout (matching the English tone), but marketing copy in your own market deserves a human pass before launch — particularly the hero headline.
- The dashboard mockup shows `app.spark.gr/dashboard`, which does not exist yet.
