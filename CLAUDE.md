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
  `setsForPhase`, `casesInSet`, `caseGroupsInSet` [partitions a set's cases into
  contiguous group sections]). Model = `Method → Phase → Set/Group → Case →
Algorithm`; `Case ↔ Set` is many-to-many via `SetMembership` (carries
  set-relative label + group + order). The seed data files were generated from
  jperm/PoC and are meant to be hand-curated.
- **`src/lib/personal.svelte.ts`** — the personal layer (local-first), separate
  from the catalog. A `PersonalStore` runes class (mirrors `theme.svelte.ts`):
  reactive `entries` keyed by `caseId`, mirrored to `localStorage`
  (`cubedrill-personal`) on change. API: `status/setStatus/cycle/count`. Status is
  per-case (shared across sets — e.g. OLL 27 in Full + 2-Look); absence ⇒
  `not-learned` (entry dropped to keep storage lean). `chosenAlgorithmId` and
  authored algs are modelled but not wired yet.
- **`src/lib/components/`** — `ui/` (Button, Card, Badge), `layout/` (AppShell,
  Sidebar, Header, BrandLogo, ThemeToggle), `cube/` (CubePlayer, CaseDiagram),
  plus PageHeader/StatCard/PlaceholderView and the set-page pieces
  `LearningStatusControl` (+ exported `STATUS_META` colour map), `CaseFilterBar`,
  `SetProgressBar`. Barrel `index.ts` re-exports everything **except `cube/`** and
  `train/` — those statically pull in heavy cubing.js, so routes import them directly
  (`$lib/components/cube`, `$lib/components/train/algorithm-trainer.svelte`) to keep
  cubing out of the main bundle (route-level code splitting).
- **`src/lib/components/train/algorithm-trainer.svelte`** — the recognition-first
  drilling loop. Takes a `pool: CaseInSet[]` (+ `setName`) and **snapshots it on
  mount** (`untrack`) so cycling a status mid-session doesn't resize the deck. One
  reused `CubePlayer` (no remount per case — props drive it). Recognition hides the
  case name + algorithm (the cube IS the prompt); Reveal shows them + Play/Reset +
  inline `LearningStatusControl`. Sequential/shuffle order, prev/next (wrap), 2D/3D
  toggle (when the phase supports both), hint-facelets toggle, a per-case recognition
  timer (feedback only — not persisted yet), and keyboard shortcuts
  (Space=reveal/next, ←/→, p=play, r=reset, s=shuffle, v=viz, h=hint, m=mark).
- **`src/lib/config/navigation.ts`** — single source of truth for sidebar nav.
- **`src/lib/theme.svelte.ts`** — light/dark/system theme controller; no-FOUC
  bootstrap script in `src/app.html`.
- **`src/app.css`** — design tokens: fixed `brand` (indigo/violet) + `cube`
  sticker palettes via `@theme`; semantic tokens (`background`, `surface`,
  `foreground`, `border`, `primary`, …) via `@theme inline` that flip with a
  class-based `.dark` (`@custom-variant dark`).
- **Routes**: dashboard `/`, the **Algorithms** hub `/algorithms` (overview — set
  cards with a two-segment `SetProgressBar`) + `/algorithms/[set]`. The set page is
  a single page with **two URL-backed modes** — `?mode=list` (default) shows cases
  grouped into sections with per-case learning-status chips; `?mode=train` renders
  the recognition-first `AlgorithmTrainer`. A List/Train segmented toggle in the
  header flips the mode. **Filter state lives in the URL** alongside it
  (`?mode=train&status=learning,mastered&group=dot`) via `goto(..., { replaceState,
keepFocus, noScroll })`, read from `page.url.searchParams`; the same `CaseFilterBar`
  drives both modes. Filtering re-runs through `personal.status()` so cycling a
  status re-filters live; the trainer drills exactly the filtered pool (keyed by
  set+filters so it re-snapshots on change). View and Train are deliberately one
  hub (nav item "Algorithms") rather than separate Library/Train pages. Plus
  placeholder pages for solver/solves/progress/settings.

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
  **real** `setTimeout` wait, then `Page.captureScreenshot`). The user must also
  confirm in a real browser for final sign-off.
- **2D vs 3D in headless**: the 2D-LL view (SVG) renders with just `--headless=new`.
  The **3D `PG3D` view needs software WebGL** or it shows only a loading spinner —
  launch with `--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader
--ignore-gpu-blocklist`. 3D also needs a longer wait (~15-20s) than 2D (~6s).
- Working recipe: launch Chrome `--headless=new --remote-debugging-port=9322 …`,
  then a tiny Node script using the `ws` package (installed in `/tmp`) drives CDP:
  fetch `http://localhost:9322/json`, open the page target's WebSocket, `Page.enable`,
  `Page.navigate`, wait, `Page.captureScreenshot`. `Runtime.evaluate` can seed
  `localStorage` / click chips to exercise stateful UI before the shot.

## Cube orientation & auto-scrambles (PARKED — under investigation)

Real findings from this session. **Most of it was reverted** — see status below.

- **Auto-scramble**: a case is derived by `setupAlg = invert(moves)`, `alg = moves`
  (cube starts at the case; `play()` solves). cubing.js default orientation is
  **white U, green F**.
- **White cross = white on the bottom**: prepend `z2` to the setup
  (`setupAlg = "z2 " + invert(moves)`), exactly as the PoC does
  (`crossColorMovesMapping.white = 'z2'`). `z2` → white bottom, yellow top, green
  front (red↔orange swap L/R — that's the genuine orientation of a standard cube
  held white-down, **not** a bug). `alg` stays unrotated; the `z2` stays baked so
  `play()` still solves. The PoC's `cube-player.svelte` is the reference.
- **Net-rotation leak (the core problem)**: pure `invert(moves)` preserves any net
  whole-cube rotation in the alg, so the displayed case ends up in the alg's _ending_
  orientation instead of canonical. **Leading** rotations were patched by appending
  the inverse in the data — committed: Aa/Ab/E/Ja PLLs now end with `x'`/`x`. A
  **mid-alg** rotation also leaks: V-perm's primary has a `y`; confirmed it renders
  the case rotated 90°, and appending `y'` makes it match a rotationless V-perm.
- **Detecting it**: run each primary alg through cubing.js (`cube3x3x3` kpuzzle,
  apply alg, check the `CENTERS` orbit moved). Across all PLL/OLL/F2L primaries only
  `pll-v/0` still has a net rotation.
- **F2L leading-`y` is worse than LL**: a leading `y` selects _which slot_ the alg
  targets, so the inverted scramble puts the pair in a back slot and the front-right
  F2L mask doesn't line up. This is what the user noticed.
- **F2L mask**: the built-in `experimentalStickering="F2L"` preset doesn't mask the
  way we want. The PoC drives orbits directly via `experimentalStickeringMaskOrbits`:
  F2L = `EDGES:----IIII----,CORNERS:----IIII,CENTERS:-----I`; single slot =
  `EDGES:----IIIII-II,CORNERS:III-IIII,CENTERS:-----I`. (`CubePlayer` had a
  `maskOrbits` prop for this — also reverted.)
- **CURRENT STATUS (committed code)**: everything above is **reverted** except the
  leading-`x` PLL inverse-appends. `cube-player` `orientation` defaults to
  `undefined` (no `z2`), no `maskOrbits`; `case-diagram` uses presets (f2l→`'F2L'`,
  oll→`'OLL'`, pll→`'full'`); V-perm has **no** trailing `y'`. The user is digging
  into the orientation/inversion approach and will choose between **(a)** curating
  algs to be rotation-neutral in the data vs **(b)** normalizing net rotations when
  deriving the scramble in `cube-player`. The future cross-color feature depends on
  this. Don't re-apply z2/maskOrbits unprompted.

## Data sources

- **OLL/PLL**: jperm's `jperm.net/lib/oll.js` & `/lib/pll.js` (structured: case
  number/name, multiple algs [his pick first], shape/swap `group`, `prob`).
- **F2L**: jperm "Best F2L Algorithms" PDF + the PoC's `f2l-standard.ts`. Case
  ids/numbering follow **speedcubedb.com**. FR + BR authored; FL/BL to be derived
  by mirroring at render time.

## Known follow-ups

- **Cube orientation / auto-scramble** — parked with the user; see the dedicated
  section above (net-rotation leak, white-cross `z2`, F2L mask orbits, F2L
  leading-`y`). Resolve this before the user-selectable cross-color feature.
- **F2L**: 11 of 41 BR algs missing; FL/BL mirroring not yet implemented; review
  seeded algorithm choices.
- **Algorithms hub** (formerly split Library/Train, now merged — see Routes) has:
  grouped case lists, per-case learning status (local-first), URL-backed status+group
  filtering, overview progress bars, and a **List/Train mode toggle** (recognition-first
  drilling loop shares the same filtered selection).
- **Train mode** still to refine when sessions land: **persist times/results** (the
  recognition timer is feedback-only now), and a smart-cube path (PoC used
  `gan-web-bluetooth`; not wired in the new app yet).
- **Normal-cube drilling gap** (discussed, parked behind the orientation work): the
  trainer shows the case but no **setup scramble**, so a non-smart-cube user can't get
  their physical cube into the case to execute. Fix = display the derived setup
  (`invert(moves)`) — but it must land the physical case in the same orientation as the
  on-screen recognition image, which depends on resolving the parked net-rotation /
  white-cross / F2L-mask work above. (Showing the long inverse doesn't meaningfully
  spoil recognition; mentally inverting a 12+ move alg isn't how anyone recalls it.)
- Still to come:
  - **Algorithm selection** — multiple algs per case + user picks one
    (`chosenAlgorithmId` already in the model; the trainer currently drills the
    `primary`/first alg).
  - **Global ⌘K search** — the deferred text-search home (in-set text search was
    intentionally skipped as low-value; see below).
  - **F2L slot filter** in `CaseFilterBar` (stubbed; waits on the mirroring work).
- **Filter design decisions** (agreed with user): group filter stays **single-select**
  (multi is niche; URL already uses comma-lists so `group=a,b` is a cheap upgrade
  later). In-set **text search dropped** — its real home is global ⌘K search.
  Collapsible groups **not needed** — filtering by group covers "focus one group".
