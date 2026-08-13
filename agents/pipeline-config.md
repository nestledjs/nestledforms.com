# Pipeline Config — nestledforms.com

## Repo

| Field                   | Value                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo_name`             | `nestledforms.com`                                                                                                                                |
| `framework`             | `nextjs`                                                                                                                                          |
| `github_slug`           | `nestledjs/nestledforms.com`                                                                                                                      |
| `base_branch`           | `develop`                                                                                                                                         |
| `repo_path`             | resolve at runtime with `git rev-parse --show-toplevel` — portable across Mac (`~/IdeaProjects`) and Linux (`~/workspaces`) hosts; never hardcode |
| `flightdesk_project_id` | `cd39bde3-16f7-4752-b55c-b49db44a25f5`                                                                                                            |
| `sdk_command`           | `none`                                                                                                                                            |

## Deployment

| Field            | Value                                                                                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto_merge`     | `true` — the adversarial verifier `MERGE` verdict is the approval — pipeline merges + deploys directly (`In Progress` → merge → `Done`), no `In Review` / human `Approved` gate (dangerous mode); see `linear-pipeline.md` → Merge Policy |
| `deploy_command` | `none` — site deploys from develop — merging IS the deploy                                                                                                                                                                                |
| `merge_command`  | `gh pr merge <prNumber> --repo nestledjs/nestledforms.com --merge --delete-branch`                                                                                                                                                        |

## Host — Railway (for Deploy Fixer mapping)

| Field                      | Value                                  |
| -------------------------- | -------------------------------------- |
| `host`                     | `railway`                              |
| `railway_project_name`     | `nestledforms.com`                     |
| `railway_project_id`       | `4068a0da-c4fc-47ab-9982-f5e726ac9ae4` |
| `railway_environment_name` | `production`                           |
| `railway_environment_id`   | `a4d643d5-95f9-4206-aa59-b842c0521643` |

Git-backed services in this project — Deploy Fixer checks **each** one's latest deployment.
Managed plugins (Postgres, Redis) are not git-backed and are not scanned.

| Service            | ID                                     |
| ------------------ | -------------------------------------- |
| `nestledforms.com` | `f295b748-9849-4b7c-ae7c-cc8c5527ca40` |

## Quality Gates

No SonarCloud on this repo — quality gates are the Intelligence Check plus canonical checks only.

## Source System — Linear (Pirate & Fox team)

| Field               | Value                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `source_system`     | `linear`                                                                                                                                         |
| Canonical lifecycle | `https://raw.githubusercontent.com/pirateandfox/qalatra-prompts/develop/linear-pipeline.md` — state IDs, GraphQL patterns, turn-taking, identity |
| `linear_project_id` | `0fcd3445-0fde-4984-b54d-7dd073415905` (Nestledforms.com)                                                                                        |
| API token           | `secret get SHI_LINEAR` (authors as Shi)                                                                                                         |
| FD task reference   | the issue's `FlightDesk` attachment                                                                                                              |

This pipeline only processes issues whose Linear project is `0fcd3445-0fde-4984-b54d-7dd073415905`. Never mutate issues
routed to other repos.

## Closeout

Approved → merge (= deploy) → archive cloud session → archive FlightDesk task (webhook usually
handles it) → **post the closing comment** → set Linear `Done` **last**, only after cleanup succeeds.

The closing comment is a **required** step and must come **before** `Done` — see _Closeout sequence_
in `linear-pipeline.md`. Observed skipped twice (cashcast PIR-265 2026-08-11, flightdesk PIR-259
2026-08-12): the handler merged, archived, and set `Done` while leaving the issue's last word as the
pipeline's own "I need a decision from you" question, so from Linear alone it read as abandoned. On
PIR-259 it was skipped even though the dispatch prompt named it explicitly — ordering it before
`Done` is the fix, asking for it is not. Verify it landed.
