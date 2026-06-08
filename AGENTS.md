<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo pins a **specific** Next.js line in the **root** [`package.json`](./package.json) (currently **Next.js 16.x** with React 19). APIs, App Router conventions, defaults, and file layout may differ from generic training data — **treat the pinned version as ground truth**, not memory.

**Before** adding routes, data fetching, caching, or config — read current Next.js documentation:

1. **Official docs (primary):** [Next.js documentation](https://nextjs.org/docs) — match the **major/minor** to `"next"` in [`package.json`](./package.json).
2. **Vendored copy (after `npm install`):** check **`node_modules/next/dist/docs/`** when that path exists; if the layout changed in a given release, search under **`node_modules/next/`** for the shipped docs folder. Use as a supplement to the official site.

Also prefer this repository’s own patterns ([`.context/architecture-context.md`](./.context/architecture-context.md), [`.context/code-standards.md`](./.context/code-standards.md)) over random tutorials.

Heed deprecation notices and migration guides for the pinned version.
<!-- END:nextjs-agent-rules -->

---

# Agent instructions (CABPL CRM Demo)

Binding rules for **automated coding agents** only (for example Cursor agents). Do not treat this file as end-user or sales documentation.

## What this repo is

A **local-only** presentation demo for **Credit Agricole Bank Polska** corporate banking CRM (Etap 1 „Quick Win”):

- **Stack:** Next.js + shadcn/ui + TypeScript, seed **JSON**, state in **React Context**, **mock login** (no DB, no deploy).
- **Goal:** working UI on a laptop via **`npm run dev`** for a client meeting (see [`.context/requirements.md`](./.context/requirements.md)).
- **Delivery model:** one task at a time from [`.context/stories/`](./.context/stories/README.md) — **no epics**.

**Do not** add production infrastructure (hosting, CI for deploy, PostgreSQL, NextAuth, SSO) unless the user explicitly asks.

---

## Context files — read in this order

Use these as the source of truth. **Do not invent behavior** that contradicts them; if something is unclear, add an **open question** in [`progress-tracker.md`](./.context/progress-tracker.md) or the relevant story/task file.

| Step | File | Why |
| --- | --- | --- |
| 1 | [`.context/progress-tracker.md`](./.context/progress-tracker.md) | **Start here:** current phase, active task, what not to duplicate |
| 2 | [`.context/project-overview.md`](./.context/project-overview.md) | Product definition, goals, in/out of scope, personas |
| 3 | [`.context/requirements.md`](./.context/requirements.md) | MUST/SHOULD features, presentation script, technical constraints |
| 4 | [`.context/CABPL-CRM-notka.md`](./.context/CABPL-CRM-notka.md) | Business background from the client meeting |
| 5 | [`.context/architecture-context.md`](./.context/architecture-context.md) | Stack, folders, Context, RBAC, RSC vs client |
| 6 | [`.context/ui-context.md`](./.context/ui-context.md) | Layout, nawigacja, skrót UI |
| 6b | [`.context/design-guide.md`](./.context/design-guide.md) | **Tokeny, kolory, auth/app shell** — referencja: `assets/screen.png` |
| 7 | [`.context/code-standards.md`](./.context/code-standards.md) | TypeScript, naming, mandatory skills |
| 8 | [`.context/ai-workflow-rules.md`](./.context/ai-workflow-rules.md) | One task per iteration, scope, tracker updates |
| 9 | [`.context/reuse-and-conventions.md`](./.context/reuse-and-conventions.md) | Reusable code — **do not re-invent** |
| 10 | Active **story** + **task** under [`.context/stories/`](./.context/stories/README.md) | Acceptance criteria for the current unit of work |

For **UI-only** tasks: still skim steps **2–5** (RBAC, demo data, no real auth). Steps **6, 6b, 7** and shadcn skill are primary. Always check **1, 9, 10**.

---

## Cursor skills (mandatory for implementation)

When writing or changing UI or Next.js code, follow:

| Skill | Path |
| --- | --- |
| **shadcn** | [`.cursor/skills/shadcn/SKILL.md`](./.cursor/skills/shadcn/SKILL.md) |
| **next-best-practices** | [`.cursor/skills/next-best-practices/SKILL.md`](./.cursor/skills/next-best-practices/SKILL.md) |

Before adding a shadcn component: `npx shadcn@latest info` and `npx shadcn@latest docs <component>` (use the project’s package runner from `package.json`).

---

## How to pick work

1. Read [`.context/progress-tracker.md`](./.context/progress-tracker.md) → **Active work** / **Next up**.
2. Open the linked **`story.md`** and exactly **one** `tasks/T-xx-yy-*.md` marked **Todo** or **In Progress**.
3. Implement **only that task** — minimal diff, happy path for the presentation scenario in [`.context/requirements.md` §6](./.context/requirements.md).
4. Do **not** skip ahead to later stories without updating the tracker (unless the user directs otherwise).

Story index and order: [`.context/stories/README.md`](./.context/stories/README.md).

---

## Implementation guardrails

| Topic | Rule |
| --- | --- |
| **Data** | Seed in `data/*.json`; CRUD via **`DemoDataContext`** — no database, no Route Handlers “for later” |
| **Auth** | Mock user picker on `/login`; **`SessionContext`** — no NextAuth, no `.env` secrets for auth |
| **RBAC** | Use **`filterByScope`** / **`canAccessEntity`** from `lib/rbac/` — do not copy `ownerId` checks into every page |
| **Deploy** | Out of scope — `npm run dev` on localhost is enough |
| **Build** | Not a gate unless the user asks |
| **Polish UI** | `pl-PL`, semantic shadcn tokens, Credit Agricole accent via CSS variables |

---

## After implementation

1. **Task / story** — Set **Status: Done** on the completed `tasks/*.md`; set story **Done** when all its tasks are done.
2. **Progress** — Update [`.context/progress-tracker.md`](./.context/progress-tracker.md) with **short** deltas only: active task path, one bullet under *Recently completed* (with links), blockers, open questions. Keep the tracker **thin**.
3. **Reuse** — New shared helpers, providers, or shell components → add a concise entry to [`.context/reuse-and-conventions.md`](./.context/reuse-and-conventions.md).
4. **Specs** — If behavior, scope, or architecture changed, update the matching `.context/*.md` in the same change set (or immediate follow-up) so the next agent run sees one truth.
5. **UI patterns** — Align with [`.context/design-guide.md`](./.context/design-guide.md) (tokens, [`screen.png`](./.context/assets/screen.png)) and [`.context/ui-context.md`](./.context/ui-context.md); extend `design-guide` when a pattern stabilizes.

Do **not** commit unless the user asks.

---

## Quick links

| Topic | File |
| --- | --- |
| Requirements & presentation path | [`.context/requirements.md`](./.context/requirements.md) |
| Progress (thin) | [`.context/progress-tracker.md`](./.context/progress-tracker.md) |
| User stories & tasks | [`.context/stories/README.md`](./.context/stories/README.md) |
| Workflow | [`.context/ai-workflow-rules.md`](./.context/ai-workflow-rules.md) |
| Reuse | [`.context/reuse-and-conventions.md`](./.context/reuse-and-conventions.md) |
| Design tokens & screen ref | [`.context/design-guide.md`](./.context/design-guide.md), [`.context/assets/screen.png`](./.context/assets/screen.png) |
| Business notatka | [`.context/CABPL-CRM-notka.md`](./.context/CABPL-CRM-notka.md) |
