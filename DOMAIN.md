# Cubedrill — Domain Model

The shared vocabulary and data model behind Cubedrill. The TypeScript types live
in `src/lib/domain/types.ts`; this document explains the concepts and the
decisions behind them. Scope today is **CFOP**, but the model is built to extend
to other methods without restructuring.

## Two layers

- **Catalog** — the built-in, shippable content: `Method → Phase → Set/Group →
Case → Algorithm`, plus `Tag`s. Mostly static, extensible, ships with the app.
- **Personal** — the user's data on top: chosen algorithms, learning status, and
  authored algorithms. **Local-first** (browser storage is the source of truth).

The catalog is **normalized**: a `Case` owns its `Algorithm`s (1-to-many), while
the `Case ↔ Set` relationship is **many-to-many** via `SetMembership`.

## Glossary

- **Method** — a solving system (CFOP). Owns an ordered list of phases. _The
  model supports multiple methods, but the UI assumes CFOP until a second exists
  — we won't add a method switcher prematurely._
- **Phase** — a stage of the method: **Cross, F2L, OLL, PLL**. Phases are
  heterogeneous (see below). Carries rendering metadata (mask, default + supported
  visualizations).
- **Case** — a specific, named, recognizable situation within a phase (`OLL 27`,
  `T`, `F2L 21`). The unit of **recognition**. Has a canonical `name`, optional
  `nickname` (`Sune`), case-level `tags`, occurrence `prob`ability, and its
  `algorithms`.
- **Algorithm** — a move sequence that solves a case. Built-in or user-authored.
  A case can have several (the `primary` one is recommended; the rest are
  alternatives). For F2L, an algorithm is authored for a specific **slot**.
  Optional `videoUrl` for a fingertrick clip. The setup/scramble is _derived_
  from the moves, not stored.
- **Algorithm Set** — a curated, named collection representing a **learning
  tier/scope** within a phase: `2-Look OLL` / `Full OLL`, `2-Look PLL` /
  `Full PLL`, `Standard` / `Advanced` / `Expert` F2L. Sets are **ordered** along
  the learning path.
- **Group** — an **ordered** sub-collection inside a set, used for the learning
  path ("learn these together"; e.g. Full OLL → Dot, Cross, Fish, …). Order is
  what makes a group distinct from a tag.
- **Set Membership** — places a case into a set (many-to-many). Carries the
  **set-relative label**, the **group**, and the **order** the case takes _within
  that set_.
- **Tag** — a flexible label for **filtering/metadata** on cases and/or
  algorithms (`ergonomic`, `two-handed`, `rotationless`, recognition group,
  difficulty, …). Unordered, many-per-item.
- **Learning Status** — the user's state per case: `not-learned → learning →
mastered`. Drives filtering, list badges, and group/goal progress.

## Phase specifics

Phases differ in nature:

- **`algorithmic`** (F2L, OLL, PLL) — enumerate cases with algorithms.
- **`conceptual`** (Cross, intuitive F2L) — learnable _techniques/tips_ rather
  than enumerated cases. Modeled later via a `Technique` concept so Cross and
  intuitive F2L aren't second-class. (Low priority.)

**Rendering metadata is intrinsic** and lives on the phase (a set may override):

- `mask` — semantic stickering (`cross` / `f2l` / `oll` / `pll`); the rendering
  layer maps it to cubing.js stickering.
- `defaultVisualization` + `supportedVisualizations` — F2L → 3D only; OLL/PLL →
  2D (default) or 3D; Cross → 3D.

## F2L specifics

F2L has dimensions OLL/PLL don't:

- **Slots** — `FR / FL / BR / BL`. FR and BR are **authored explicitly** (they're
  genuinely different — mirroring BR from FR is suboptimal). **FL is derived from
  FR, BL from BR** by mirroring, with per-slot **overrides** allowed.
- **Subsets** — Standard (41+1, well-defined), Advanced, Expert are **distinct
  case lists** (Advanced/Expert are real but less rigidly defined). Modeled as
  separate sets over distinct cases.

**Deferred (parked):**

- **Pair/insert two-stage split.** F2L algorithms often (not always) split into
  two logical stages — **forming the pair** then **inserting it** — which mirrors
  intuitive F2L and helps a lot when learning. We'd like to visualize the two
  stages and even drill _only the pairing_ part (insertions are reusable once a
  few are known). Leaning toward **computing** the split from the move sequence
  (detect when the corner+edge pair is formed, the remainder is the insertion)
  rather than storing it in the model, with an optional manual override later if
  the heuristic is imperfect. Not tackled yet — F2L is already complex enough.
- Advanced cubers keep **multiple "main" algorithms per case** for different
  situations (normal / rotationless-despite-misoriented-edge / exploits a free
  back slot). The model already allows many algorithms per case and won't cap a
  case at one chosen algorithm; the situational selection UX is future work.
- **Per-slot learning status** (you might know FR but not BL). Status is per-case
  for now.
- **Auto-derived tags** (e.g. F2L `cross-sticker-faces`, `edge-is`) computed from
  the cube state.

## Overlapping sets & set-relative naming (decision)

A case can belong to multiple sets. The 7 all-edges-oriented OLLs (21–27) are the
**same cube state** in both Full OLL and 2-Look OLL — only the convention differs
(`OLL 27` vs `Sune`). We model this as **one shared case with a set-relative
label** (and set-relative group). Upside: mastering it in 2-Look **automatically
counts** toward Full OLL, because it's the same case.

## Extensibility & sourcing notes

- **Sets across methods (future).** Today a set belongs to one phase of one
  method (`Set → phase → method`). With multiple methods a phase/set can be
  **shared** (F2L belongs to both CFOP and ZB), making these relationships
  many-to-many. Not needed while CFOP is the only method; revisit when a second
  method lands.
- **How many algorithms we ship.** The model supports multiple algorithms per
  case, but Cubedrill will likely ship **one** per case for most cases — both
  because reference-algorithm authority is debatable and to avoid copying others'
  curated sets wholesale. The seed data is a starting point, to be curated.

## Data sources

- **F2L** — J Perm's "Best F2L Algorithms" sheet (Standard / Advanced / Expert).
  Case ids/numbering follow **speedcubedb.com**.
- **OLL / PLL** — J Perm's algorithm data (`jperm.net/lib/oll.js`,
  `/lib/pll.js`): case numbers/names, **multiple algorithms** (his pick first),
  **shape/swap groups**, and per-case **probability**. Full PLL is seeded in
  `src/lib/domain/data/pll.ts` (generated, then curatable).

## Status of this model

Seeded and validated with **Full PLL** (21 cases, 3 groups, 55 algorithms).
Next: seed **Full OLL** (from jperm data) and **Standard F2L** (FR + BR, derived
FL/BL), then design the Library view on top.
