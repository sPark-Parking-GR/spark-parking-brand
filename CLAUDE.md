# sPark Brand / Landing — Claude Code governance

The public landing site. A deliberately tiny static-site builder: plain Node ESM scripts,
no framework, no bundler.

This repo is **self-contained**: its own lockfile, pinned `packageManager` and tooling.
`prettier` is its only dependency — the build, dev server and tests are plain Node.

## Layout

```
scripts/build.mjs       — renders src/ into dist/
scripts/dev.mjs         — local dev server with rebuild
scripts/serve.mjs       — serves a built dist/
scripts/smoke.test.mjs  — the test suite (node --test)
src/template.mjs        — page shell
src/content.mjs         — copy, per locale
src/main.js             — client-side script
src/styles.css          — styles
src/assets/             — fonts, icons, marks — COPIED WHOLESALE INTO dist/
reference/              — brand reference images, NOT shipped
```

**Anything you put in `src/assets/` is published.** `build.mjs` copies that directory
wholesale into `dist/assets`. Design references, palette sheets and working files belong
in `reference/`, which the build ignores.

## Commands

| Command                 | Does                                       |
| ----------------------- | ------------------------------------------ |
| `pnpm run dev`          | dev server with rebuild                    |
| `pnpm run build`        | renders `dist/` (routes `/` and `/en/`)    |
| `pnpm run start`        | serves an already-built `dist/`            |
| `pnpm run test`         | `node --test` over `scripts/**/*.test.mjs` |
| `pnpm run format:check` | Prettier check                             |

## Coding standards

- Plain ESM (`.mjs`) Node scripts. Keep it dependency-free — if something seems to need a
  framework or bundler, that is a signal to reconsider, not to add one.
- No comments unless the WHY is non-obvious.
- Content is data: copy lives in `src/content.mjs`, keyed per locale. Do not inline user-
  facing strings into the template.
- Every route must be generated for each supported locale.

## Security rules

- This site is fully public and fully static. Never put a key, token or endpoint secret
  into `src/` — it is served verbatim.
- No analytics or third-party script without checking it against the site's own CSP and
  the privacy posture of the rest of the platform.

## Definition of done

- [ ] `pnpm run build` succeeds and the rendered routes look right
- [ ] `pnpm run test` passes
- [ ] `pnpm run format:check` passes
- [ ] Copy added for every locale, not just one
- [ ] Nothing secret or unshipped added under `src/assets/`

## Branch and commit discipline

- Feature branches off `main`.
- Commits: `type(scope): message` — e.g. `feat(landing): add pricing section`.
- No direct pushes to `main`.
