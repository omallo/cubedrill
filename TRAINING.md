# Cubedrill — Training Model & Signals

Companion to **`VISION.md`** (product vision) and **`DOMAIN.md`** (catalog &
vocabulary). This captures the _conceptual_ design of the training experience:
the drilling loop, the signals it produces, and how those feed the learning
path. It is a design doc — the **recall drill** is built; the **fluency** layer
and **learning path** are largely future. Read it before non-trivial work on the
trainer, stats, goals, or smart-cube support.

## 1. One loop, a few knobs

There is a single training loop:

> **present a case → recognize & execute → capture `{ correct?, time }` → next**

Everything else is a knob on that loop, not a separate mode:

- **Scope** — a single case (groove it by repetition) or the filtered set.
- **Pacing** — self-paced (you advance) or timed (a per-case budget auto-advances).
- **Recognition source** — _screen_ or _cube_ (see §4). Explicit, any cube.
- **Cube type** — implicit: a Bluetooth cube is either connected or not (see §4).

"Recall" vs "drill" is just the gentle vs aggressive end of the pacing/scope
dials, not a distinct concept. The dial runs: _learn/groove_ (single, slow,
peeking) → _drill_ (set, timed, no peeking).

**Built today:** the recall drill — self-paced, screen recognition by default,
self-graded (Got it / Hesitated / Blanked), with an on-demand session summary.

## 2. Two dimensions of "knowing"

Knowing an algorithm is two different things. Keep them as **separate
dimensions** — do not fold speed into the status enum (a cuber says _"I know all
21 PLLs but I'm slow on three"_: that's mastered coverage + a fluency gap).

| Dimension        | Question          | Signals                                       | Drives                                    |
| ---------------- | ----------------- | --------------------------------------------- | ----------------------------------------- |
| **A — Coverage** | _Do I know it?_   | learning status _(authoritative)_             | breadth: repertoire, ordering, completion |
| **B — Fluency**  | _How fast/solid?_ | recognition time, execution time, consistency | depth: refine queue, speed goals          |

Coverage is the backbone (user-meaningful, works on any cube). Fluency is the
overlay — and crucially it is **the dimension that exists beyond `mastered`**:
status tops out, but speedcubing improvement does not, and only timing captures
that back half of the journey.

## 3. Signal catalog

| Signal               | What it is                                  | Source                                               | Feeds                                      | MVP                            |
| -------------------- | ------------------------------------------- | ---------------------------------------------------- | ------------------------------------------ | ------------------------------ |
| **Coverage status**  | not-learned → learning → mastered, per unit | user chips + session suggestions                     | ordering, coverage goals, breadth progress | ✅ built — **authoritative**   |
| **Recall accuracy**  | got / hesitated / blanked rate + streak     | self-grade _(smart: auto from move-verify)_          | status _suggestions only_ (advisory)       | ✅ built — advisory only       |
| **Recall latency**   | case-shown → reveal (mental, self-paced)    | app timer                                            | light feedback only — **never goals**      | ⚠️ collected, not load-bearing |
| **Correctness**      | did the executed alg actually solve it      | from-cube: observed · screen: none · smart: verified | objective accuracy; mistake detection      | 🔶 manual self-report now      |
| **Recognition time** | cube-in-case → first move                   | smart cube only (not separable by hand)              | recognition-speed goals; weak-recognition  | ⛔ smart-cube era              |
| **Execution time**   | first move → solved                         | smart auto · manual = fused stopwatch                | execution-speed goals; weak-case surfacing | ⛔ drill + smart cube          |
| **Consistency**      | variance of a case's times                  | derived                                              | reliable-vs-flaky → refine priority        | ⛔ deferred                    |

## 4. Two axes gate the signals

Signal availability and trust depend on **two orthogonal axes**, not a single
dumb/smart spectrum:

- **Recognition source** — _screen_ (read the case off the on-screen cube; no
  scramble) or _cube_ (apply the setup scramble, read your physical cube). This
  axis decides whether a **physical solve** happens at all → it gates manual
  correctness and any hand timing.
- **Verification** — _manual_ (you self-grade; you stopwatch) or _smart_ (a
  Bluetooth cube auto-verifies moves and times you). Cube type is implicit:
  connected ⇒ smart available.

What lights up (each cell **adds** to the ones above/left):

|                        | Manual (self)                                               | Smart (Bluetooth)                                                                                       |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Screen recognition** | status, recall accuracy (self), recall latency              | + objective correctness, execution time _(recognition split fuzzy — you didn't recognize off the cube)_ |
| **Cube recognition**   | + correctness (observed "did it solve"), fused attempt time | + clean recognition/execution split, auto-grade — **full fidelity**                                     |

Takeaway: **cube type doesn't change the path — it sharpens the fluency half.**
The path runs on the bottom-left rung's signals (universal); the smart cube +
cube recognition is what makes fluency precise enough to grade.

## 5. What consumes each signal

- **Ordering ("learn next")** ← coverage status **+ static curation**
  (prerequisites like 2-look before full; case frequency; build on the known).
  _Timing barely participates here._
- **Status suggestions** ← recall accuracy (advisory; user still clicks to apply).
- **Coverage goals & progress** ← status (counts / % per set / group).
- **Refine queue / weak cases** ← timing + consistency (the _reverse_ of
  ordering: re-surface known-but-slow cases).
- **Fluency goals** ← recognition / execution-time thresholds — _honest only at
  smart-cube fidelity._

## 6. The learning path (future)

The rough vision: Cubedrill suggests an order to learn things (sets, groups,
cases), lets you set goals, and tracks them. Mapped onto the two dimensions:

- **Ordering & coverage goals** are dimension A — driven by status + curation.
  e.g. _"complete 2-Look OLL"_, _"master all 21 PLLs"_.
- **Refine queue & fluency goals** are dimension B — driven by timing.
  e.g. _"all PLL recognition under 2s"_, _"no F2L case slower than 3s"_.

A case moves through three phases, and **which signal leads shifts by phase**:

1. **Acquire** (`not-learned → learning`) — signal: recall _success_. Timing is
   noise (you're slow because you're learning).
2. **Consolidate** (`learning → mastered`) — success becomes consistent; timing
   is only a readiness check.
3. **Refine** (beyond `mastered`) — status is maxed; **timing is the only
   signal left**, and weak/flaky cases drive what to re-drill.

## 7. MVP boundary

**In MVP — drive the path on Coverage:**

- Status (built) · accuracy → suggestions (built)
- Ordering / "learn next" (static curation + status)
- Coverage goals + tracking
- A modest per-case stats surface

**Feedback-only, no goals built on it:** recall latency.

**Deferred to the smart-cube / drill era (the whole Fluency dimension):**
recognition time, execution time, consistency, fluency goals, objective
auto-grade. Design data shapes to _accept_ these later; don't gate the MVP on
them.

## 8. Decisions on record

1. **Status is manually authored** (chips) with session _suggestions_.
   Consequently **status is the sole authoritative signal for Coverage**; recall
   accuracy is **advisory only** — it powers suggestions and nothing else.
2. **The Fluency dimension is hidden in the UI** until smart-cube-fidelity data
   exists. We do not show timing numbers we don't trust.
3. **Recall latency is kept** as lightweight feedback, but never feeds status,
   suggestions, or goals.
4. **Recognition source (screen/cube) and verification (manual/smart) are
   orthogonal axes** — not a single dumb/smart spectrum.
