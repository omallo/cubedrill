# Cubedrill — Product Vision

## 1. Overview

Cubedrill is a web application for **speedcubers** that helps them **assemble, learn,
train, and track a personal repertoire of solving algorithms**.

Unlike general speedcubing platforms whose primary purpose is full-solve timing and
leaderboards, Cubedrill's center of gravity is the **personal algorithm journey**:
curating a personal algorithm set (starting from Cubedrill's built-in library, then
customizing it), learning those algorithms, drilling them, training partial and full
solves built from them, and getting clear feedback on learning progress.

The initial focus is the **CFOP method** for the 3x3x3 cube, but the data model and UI
must be **extensible to other methods** (e.g. ZB) and, eventually, other puzzles.

> **Scope key used throughout this document**
>
> - **[MVP]** — part of the first shippable product (CFOP-focused).
> - **[Future]** — explicitly planned but out of scope for the MVP.

---

## 2. Goals & Non-Goals

### Goals

- Help users **build a personal algorithm set** from a curated, customizable library.
- Make **learning and drilling algorithms** efficient, focused, and measurable.
- Support **partial solves** (e.g. only F2L / OLL / PLL, or a single last F2L pair) in
  addition to full solves, so practice can target a specific weakness.
- Provide an **automatic solver** that solves a scramble _the way the user would_ —
  using the algorithms the user is actually learning — as a teaching aid.
- Give users **goals, sessions, stats, and feedback** that guide the learning process.
- Stay **method-extensible** (CFOP first, ZB and others later).

### Non-Goals

- Becoming a general-purpose competition/leaderboard platform.
- Being primarily a full-solve timer (timing exists, but in service of learning).
- Replacing official WCA tooling or competition management.

---

## 3. Target Users

- **Improving speedcubers** moving from beginner methods toward full CFOP.
- **Intermediate/advanced cubers** filling gaps (e.g. full OLL/PLL, advanced F2L).
- Cubers who want a **structured, trackable learning path** rather than ad-hoc practice.

Users range from "just learned the beginner method" to "knows full CFOP and is
refining algorithms," so the app must support both **guided onboarding** and
**deep customization**.

---

## 4. Core Concepts & Domain Model

These are the conceptual entities the product is built around. They inform both the
data model and the UI.

### 4.1 Method

A solving system composed of ordered **phases**.

- **CFOP** [MVP] → phases: **Cross → F2L → OLL → PLL**.
- **ZB** and others [Future].

### 4.2 Phase

A stage within a method (e.g. F2L, OLL, PLL). A phase groups the algorithm sets and
cases relevant to that stage of the solve.

### 4.3 Case

A specific recognizable situation the cuber must solve within a phase (e.g. a specific
OLL shape, a specific F2L pair configuration). A case has:

- A canonical name/identifier (e.g. standard OLL/PLL naming).
- A **recognition image** (the pattern the user sees on the cube).
- One or more **algorithms** that solve it.
- **Variants** where applicable (see F2L slot variants below).

### 4.4 Algorithm

A concrete move sequence (in standard cube notation) that solves a case.

- Belongs to one or more **algorithm sets**.
- Carries **tags** (for grouping/metadata, see below).
- Can be **built-in** (from Cubedrill's library) or **user-authored**.
- Users can **override/customize** the algorithm chosen for a case in their personal set.

### 4.5 Algorithm Set

A named, curated collection of algorithms/cases for a phase. Cubedrill ships a built-in
library grouped into sets. **MVP built-in sets:**

| Phase | Set              | Notes      |
| ----- | ---------------- | ---------- |
| F2L   | **Standard F2L** | 41+1 cases |
| F2L   | **Advanced F2L** |            |
| F2L   | **Expert F2L**   |            |
| OLL   | **2-Look OLL**   |            |
| OLL   | **Full OLL**     |            |
| PLL   | **2-Look PLL**   |            |
| PLL   | **Full PLL**     |            |

> Cross is solved intuitively and typically has no algorithm set; it still appears as a
> phase for solve/scramble purposes.

### 4.6 F2L Slot Variants

F2L cases can have **variants by target slot**: **front-right, back-right, back-left,
front-left**. A user may learn/drill a case for a specific slot or across all slots.

### 4.7 Tags

Free-form (or curated) labels attached to algorithms for grouping related algorithms or
attaching metadata (e.g. "ergonomic", "two-handed", "rotationless", "intuitive",
difficulty, recognition group). Tags drive **filtering** in the list and train views.

### 4.8 Personal Algorithm Set

The user's curated, customizable selection across sets — which cases they're learning,
which algorithm they've chosen for each case, and their custom/authored algorithms.
This is the **heart of the product**.

### 4.9 Learning Status

Per-case (and per-algorithm) state tracking the user's progress, e.g.
_Not started → Learning → Drilling → Known_, derived from training activity and stats.

### 4.10 Scramble & Solve Types

- **Scramble types**: full scramble, or a **specialized scramble** that leaves part of
  the cube solved — e.g. cross solved, F2L solved, OLL solved, or a scramble designed
  for a **single last F2L pair**.
- **Solve targets**: solve to completion, or solve **only a chosen segment** (F2L only,
  OLL only, PLL only, last F2L pair only, etc.).

### 4.11 Training Goal

A user-defined objective (e.g. "learn full PLL", "get all OLL recognition under 2s").
Has progress derived from learning status and stats.

### 4.12 Training Session

A bounded practice activity (a set of reps / a time window) producing **times** and
**results** that feed stats and progress.

---

## 5. Functional Requirements

### 5.1 Algorithm Visualization [MVP]

- Render cube cases and algorithms using **2D diagrams** (sticker/flat view) for lists,
  sheets, and recognition, and an **interactive 3D cube** for training/solver playback
  and step-through.
- Animate algorithm execution move-by-move; allow play/pause/step/scrub and reset.
- Show standard move notation alongside the visualization.

### 5.2 Algorithm Library & Personal Set [MVP]

- Browse the built-in library grouped by method → phase → algorithm set.
- Select which sets/cases to include in the **personal algorithm set**.
- For each case, choose among provided algorithms or **author a custom one**.
- **Validate** user-authored algorithms (a correct algorithm must actually solve the
  case — verifiable via the cubing engine).

### 5.3 Algorithm Training [MVP]

- Drill **individual algorithms** or whole **algorithm sets**.
- Filter the training pool by set, tags, learning status, and F2L slot variant.
- Recognition-first flow: show the case, user performs/recalls the algorithm, record
  result and time.
- Provide a smooth **transition from the list view into a train view** for the current
  selection/filter.

### 5.4 Solver [MVP]

An **automatic, human-style solver**:

- User defines a **scramble type** (full, or partial leaving cross/F2L/OLL solved, or a
  last-F2L-pair scramble).
- User defines the **solve target** (to end, or only F2L/OLL/PLL/last pair).
- The solver produces a solution **using the algorithms the user is learning** (their
  personal set), so output doubles as a learning/explanation aid.
- Step through the solution on the 3D cube with per-phase/per-algorithm breakdown.

### 5.5 Solves Practice [MVP]

- Perform **full solves** and **partial solves** (starting from specialized scrambles).
- Capture times and per-phase splits where applicable.

### 5.6 Goals, Sessions & Progress Tracking [MVP]

- Create and follow **training goals**.
- Define and run **training sessions**.
- Track **learning progress** across cases/sets and over time.

### 5.7 Time Tracking [MVP]

- Track times for **individual algorithms**, **partial solves**, and **full solves**.
- Persist history to power stats and feedback.

### 5.8 Stats & Feedback [MVP]

- Surface meaningful stats (recognition/execution speed, accuracy, consistency,
  coverage of a set, weak cases) and **actionable feedback** that guides what to
  practice next.

### 5.9 Bluetooth / Smart Cube Support [MVP]

- **Optional progressive enhancement:** the app is fully usable with a regular cube and
  keyboard/touch input. A **Bluetooth smart cube is never required**, but when one is
  connected the app **leverages its advantages**.
- When connected (via cubing.js smart-cube support):
  - **Live cube state** mirrors the physical cube into the 2D/3D visualization.
  - **Automatic move/solve detection** — start/stop timing and recognize solve
    completion from real moves, removing the need for manual timer input.
  - **Move-accurate feedback** — verify whether the user actually executed the correct
    algorithm, detect mistakes, and measure recognition vs. execution time separately.
  - **Scramble guidance** — guide the user to apply a generated scramble on the physical
    cube and confirm it's set correctly.
- **Graceful degradation:** every feature has a non-Bluetooth path; connection state is
  clearly surfaced, and losing/declining the connection never blocks core flows.

### 5.10 Gamification [Future]

- Optional motivational layer (streaks, milestones, badges) layered on top of goals and
  progress. Designed not to compromise the learning-first focus.

### 5.11 Extensibility [MVP-aware, partially Future]

- The domain model (method → phase → set → case → algorithm) must accommodate **new
  methods** (ZB) and additional sets without restructuring. MVP ships CFOP only but the
  architecture must not assume CFOP-specific phases.

---

## 6. Primary Views (UI)

The following are the main views. Others may emerge during design.

### 6.1 Algorithm List View [MVP]

- Browse algorithms/cases with **2D recognition diagrams**.
- **Select algorithm sets** and **filter by tags** (and by learning status, F2L slot).
- Indicate which cases are in the personal set and their learning status.
- Entry point for **authoring/customizing** algorithms.
- **Transition into the Train view** carrying the current selection/filter.

### 6.2 Algorithm Train View [MVP]

- Same selection/filter capabilities as the list (sets, tags, status, slot).
- Recognition + execution drilling loop with timing and result capture.
- 3D playback/reveal of the correct algorithm; immediate feedback.

### 6.3 Solver View [MVP]

- Inputs: **scramble type** and **solve target** (per §4.10 / §5.4).
- Generates a scramble and a **human-style solution** from the personal set.
- 3D step-through with phase/algorithm breakdown and notation.

### 6.4 Progress View (Goals, Sessions, Stats) [MVP]

- Create/track **training goals**.
- Start/track **training sessions**.
- Dashboards for **progress, stats, and feedback** over time.

### 6.5 Personal Set / Library Management View [MVP]

- Manage the personal algorithm set: include/exclude cases, pick or author algorithms,
  organize via tags.

> **UI design notes for `claude design`:** prefer 2D sticker diagrams in dense list/sheet
> contexts and the interactive 3D cube in focused training/solver contexts. Filtering by
> set + tags is a recurring control and should be a consistent, reusable pattern across
> list and train views. Design every timing/recognition flow to work **without** a
> Bluetooth cube, with an unobtrusive connection affordance that unlocks enhanced
> (auto-timed, move-verified) behavior when a smart cube is present.

---

## 7. Look & Feel / Branding

- **Modern and minimal:** clean layouts, generous whitespace, strong typographic
  hierarchy, and restrained use of color. Content (the cube, diagrams, stats) is the
  hero; chrome stays out of the way.
- **Clear, consistent branding:** a coherent Cubedrill identity — name, logo/mark, a
  defined color palette and type scale — applied consistently across all views. The
  palette can draw on cube sticker colors as accents without becoming visually noisy.
- **Focus-first interactions:** training and solver views should feel calm and
  distraction-free so users can concentrate on recognition and execution.
- **Responsive:** works well on desktop and adapts gracefully to smaller screens.
- **Accessible:** sufficient contrast and color-blind-friendly cues (don't rely on cube
  color alone to convey meaning).
- A small, reusable **design system** (tokens for color/spacing/typography, shared
  components) should back the consistent look — a natural fit with Tailwind CSS.

---

## 8. Technical Direction

- **Frontend framework:** **Svelte / SvelteKit**.
- **Styling:** **Tailwind CSS**.
- **Cubing engine / visualization:** **[cubing.js](https://github.com/cubing/cubing.js/)**
  — used for cube state, move notation, scramble generation, algorithm
  application/validation, and both 2D and 3D rendering.
- **Persistence model:** **Local-first**. The app is fully usable without an account
  (data in local/browser storage); an **optional account** enables cross-device sync.
  - Implication: the data layer should treat the local store as the source of truth with
    sync as an additive concern, not a prerequisite.
- The rest of the stack (backend for sync/accounts, storage, hosting) is **open** and to
  be decided during implementation.

---

## 9. MVP Summary

The first shippable version targets **CFOP** and includes:

- Built-in F2L / OLL / PLL algorithm sets (per §4.5).
- Personal algorithm set with custom algorithm authoring + validation.
- 2D + 3D visualization via cubing.js.
- Algorithm list and train views with set/tag/status/slot filtering and list→train flow.
- Human-style solver with configurable scramble types and solve targets.
- Full and partial solve practice with time tracking.
- Goals, sessions, progress, stats, and feedback.
- Optional Bluetooth smart-cube support as a progressive enhancement (never required).
- Local-first persistence with optional account sync.

**Deferred to later:** additional methods (ZB), gamification layer, and any features not
listed above.
