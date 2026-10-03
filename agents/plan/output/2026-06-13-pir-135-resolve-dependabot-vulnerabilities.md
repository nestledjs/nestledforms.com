# PIR-135 — Plan output summary

**Original task:** Resolve open Dependabot vulnerabilities on nestledforms.com — 1 critical, 7 high, 5 moderate, 2 low (15 alerts total).

**Plan file:** `agents/plan/plans/2026-06-13-pir-135-resolve-dependabot-vulnerabilities.md`

## Verified findings (live Dependabot API)

- **1 critical:** `shell-quote` (dev, transitive) — fix at 1.8.4.
- **13 `next` alerts** (7 high, 4 moderate, 2 low) — all clear at next ≥ 15.5.18; latest patch 15.5.19. Current: 15.5.12.
- **1 moderate:** `postcss` (transitive, two lockfile instances 8.5.6 + 8.4.31) — fix at 8.5.10.

## Key decisions

1. **Bump `next` 15.5.12 → ^15.5.19** (stay on 15.5.x line; do NOT go to 16.x — avoids a major-version jump per acceptance criteria). Min needed is 15.5.18; 15.5.19 is latest patch. Also bump `eslint-config-next` to match.
2. **Pin transitive deps via the existing `pnpm.overrides` block** (which already holds tar/glob/lodash/minimatch): add `shell-quote >=1.8.4` and `postcss >=8.5.10`.
3. **No source-code changes expected** — pure dependency/lockfile work. `pnpm install` regenerates the lock.
4. Verification: `pnpm lint` + `pnpm type-check` + `pnpm build`, render check on port 3002, and re-query Dependabot post-merge to confirm 0 open alerts.

Files touched: `package.json`, `pnpm-lock.yaml`.
