# Cubedrill — Working Notes for Claude

Cubedrill is a web app for speedcubers to assemble, learn, train, and track a
personal repertoire of solving algorithms (CFOP-first). See **`VISION.md`** for
the product vision and **`DOMAIN.md`** for the domain model & vocabulary — read
both before non-trivial work.

A small proof-of-concept lives at **`~/dev/archive/cubedrill`** (minimal, more
functional-than-polished). Study it for reference; don't copy blindly — the new
app is more branded/structured and the domain model is richer.

## Tech stack

- **SvelteKit + Svelte 5 (runes)** + **TypeScript**
- **Tailwind CSS v4** (no DaisyUI — custom design system) + `@tailwindcss/forms`, `@tailwindcss/typography`
- **lucide-svelte** (icons), `clsx` + `tailwind-merge` (the `cn()` helper)
- **cubing.js** (`cubing`) for cube state/notation and 2D/3D rendering via `<twisty-player>`
- Kit config is inlined in `vite.config.ts` (no separate `svelte.config.js`); adapter-auto
- **Local-first, client-rendered**: SSR is disabled globally (`src/routes/+layout.ts` `ssr = false`)

## Commands

- `npm run dev` — dev server
- `npm run check` — svelte-check (types). Run after changes.
- `npm run lint` — prettier check + eslint
- `npm run format` — prettier write
- `npm run build` — production build (adapter-auto warns about platform; that's expected)

## Conventions

- **Formatting**: 2-space indentation (`.prettierrc`, `.editorconfig`). Always `npm run format`.
- **Files**: kebab-case filenames; components export PascalCase via barrels.
- **Icons**: lucide icons are legacy class components → type icon props as
  `IconComponent` from `$lib/types` (`typeof import('lucide-svelte').Icon`),
  NOT svelte's deprecated `ComponentType` or the `Component` type (which lucide
  icons don't satisfy). Use current icon names (e.g. `WandSparkles`, `ChartColumn`,
  not deprecated `Wand2`/`BarChart3`).
- **Git** (per user): `feat:`/`fix:` prefixes; commit to `main` without pushing;
  **wait for the user to ask before committing**; amend into the prior commit when
  a change logically belongs to it; one commit per logical step. End commit
  messages with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## Architecture

- **`src/lib/domain/`** — the domain model (normalized catalog). `types.ts`,
  `catalog.ts` (CFOP method + phases), `data/{pll,oll,f2l}.ts` (seeded sets),
  `index.ts` (assembled `catalog` + lookup helpers: `getPhase/getSet/getCase`,
  `setsForPhase`, `casesInSet`). Model = `Method → Phase → Set/Group → Case →
Algorithm`; `Case ↔ Set` is many-to-many via `SetMembership` (carries
  set-relative label + group + order). Personal layer (status/chosen algs) is
  separate and local-first. The seed data files were generated from jperm/PoC and
  are meant to be hand-curated.
- **`src/lib/components/`** — `ui/` (Button, Card, Badge), `layout/` (AppShell,
  Sidebar, Header, BrandLogo, ThemeToggle), `cube/` (CubePlayer, CaseDiagram),
  plus PageHeader/StatCard/PlaceholderView. Barrel `index.ts` re-exports
  everything **except `cube/`** — cube components statically pull in heavy
  cubing.js, so routes import them directly from `$lib/components/cube` to keep
  cubing out of the main bundle (route-level code splitting).
- **`src/lib/config/navigation.ts`** — single source of truth for sidebar nav.
- **`src/lib/theme.svelte.ts`** — light/dark/system theme controller; no-FOUC
  bootstrap script in `src/app.html`.
- **`src/app.css`** — design tokens: fixed `brand` (indigo/violet) + `cube`
  sticker palettes via `@theme`; semantic tokens (`background`, `surface`,
  `foreground`, `border`, `primary`, …) via `@theme inline` that flip with a
  class-based `.dark` (`@custom-variant dark`).
- **Routes**: dashboard `/`, `/library` (overview) + `/library/[set]` (cases),
  and placeholder pages for train/solver/solves/progress/settings.

## cubing.js — hard-won gotchas (IMPORTANT)

The `<twisty-player>` custom element is finicky. Lessons from debugging:

- **NEVER set `display` on `<twisty-player>`.** A `display: block` (e.g. Tailwind
  `block`) overrides the element's own host display and collapses its internal
  layout so the cube renders at **0 height (blank, no error)**. This caused a long
  blank-cube hunt. Size it with `h-full w-full` (or explicit px) but no `display`
  utility. The host needs a resolvable height from its parent.
- **Hide controls with `controlPanel="none"`** (camelCase prop via Svelte). It
  works fine — the earlier belief that it was "broken" was actually the `display:
block` bug. Other useful attrs: `background="none"`, `visualization`
  (`PG3D` for 3D, `experimental-2D-LL` for 2D last-layer), `experimentalStickering`
  (`OLL`/`PLL`/`F2L`/`Cross`/`full`), `experimentalSetupAlg`, `alg`, `hintFacelets`.
- Render the **case** by setting `alg` = solution and `experimentalSetupAlg` =
  `Alg(moves).invert()` (so the cube starts at the case and `play()` solves it).
- cubing.js renders into a **closed shadow root** → you can't query/style its
  internals from JS or external CSS; `bind:this` is typed `any`.
- `CaseDiagram` lazy-mounts each cube via `IntersectionObserver` so a 41-case F2L
  page doesn't spin up dozens of WebGL contexts at once. Keep this.
- Import: a side-effect `import 'cubing/twisty'` registers the element; `Alg` from
  `cubing/alg`. Do NOT add `optimizeDeps.exclude: ['cubing']` (tried; unnecessary
  and unhelpful).

## Verifying cube rendering (screenshots)

- **Old headless Chrome renders NO cubing** (no WebGL). Use `--headless=new`.
- `--virtual-time-budget` does not drive cubing's render loop reliably. Capture
  via the **DevTools Protocol** (`--remote-debugging-port`, `Page.navigate`, a
  **real** `setTimeout` wait ~10s, then `Page.captureScreenshot`). The user must
  also confirm in a real browser for final sign-off.

## Data sources

- **OLL/PLL**: jperm's `jperm.net/lib/oll.js` & `/lib/pll.js` (structured: case
  number/name, multiple algs [his pick first], shape/swap `group`, `prob`).
- **F2L**: jperm "Best F2L Algorithms" PDF + the PoC's `f2l-standard.ts`. Case
  ids/numbering follow **speedcubedb.com**. FR + BR authored; FL/BL to be derived
  by mirroring at render time.

## Known follow-ups

- PLLs that begin with a whole-cube rotation (e.g. `Aa`/`Ab` start with `x`)
  render tilted in the 2D recognition view — normalize/strip rotations for the
  recognition diagram.
- F2L: 11 of 41 BR algs missing; FL/BL mirroring not yet implemented; review
  seeded algorithm choices.
- Library is at the "render cases" stage — filtering, groups, status, personal-set
  editing, and the list→train transition are still to come.
