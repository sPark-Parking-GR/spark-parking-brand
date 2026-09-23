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

## Behaviour

- **Audience toggle** — swaps hero copy, hero mockup (phone ↔ dashboard), steps, features, and CTA band. Nav and footer links also switch audience.
- **Theme** — follows the OS by default; the toggle sets a `data-theme` override persisted in `localStorage` under `spark-theme`. An inline head script applies it before paint, so there is no flash.

## Contact — and the no-PII rule

**This page collects no personal information of any kind.** There are no forms, no input fields, no analytics, no cookies, no third-party scripts, and nothing is ever transmitted to a server — the built pages make **zero requests to any external origin**, fonts included. Every contact and lead path is a `mailto:` to the company address, so enquiries arrive in a normal inbox and the site itself never touches personal data.

One constant drives every CTA, in `src/content.mjs`:

```js
export const CONTACT_EMAIL = 'smart.parking.gr@gmail.com'
```

Each CTA passes its own subject line (waitlist, demo request, general enquiry) — localized per language, so a Greek visitor's email arrives with a Greek subject. The address is also printed as readable text in the footer, not hidden behind a link.

The only client-side storage is `localStorage['spark-theme']`, holding `"light"` or `"dark"`. That is a functional preference, not personal data, and needs no consent banner.

`scripts/smoke.test.mjs` enforces all of the above — adding a form, an input, an analytics snippet, a cookie, or a `fetch()` call fails the build. **Do not relax those tests without an explicit decision to change the policy**, since dropping them silently turns a no-PII page into a data-collecting one.

## Commands

```bash
pnpm --filter @spark/landing dev     # http://localhost:3002
pnpm --filter @spark/landing build   # emits dist/
pnpm --filter @spark/landing start   # serves dist/
pnpm --filter @spark/landing test    # markup/copy smoke tests
```

`PORT` env var overrides the port.

## Deploy

`dist/` is a plain static directory — drop it on any static host. `/en/` is a real directory with its own `index.html`, so no rewrite rules are needed.

| Host                                | Setting                                                                |
| ----------------------------------- | ---------------------------------------------------------------------- |
| Vercel / Netlify / Cloudflare Pages | build `pnpm --filter @spark/landing build`, output `apps/landing/dist` |
| S3 / nginx / GitHub Pages           | upload `apps/landing/dist`                                             |

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
