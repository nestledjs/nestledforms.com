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

| Field            | Value                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auto_merge`     | `true` — the adversarial verifier `MERGE` verdict is the approval; the pipeline merges + deploys directly with no human approval gate (dangerous mode) |
| `deploy_command` | `none` — site deploys from develop — merging IS the deploy                                                                                             |
| `merge_command`  | `gh pr merge <prNumber> --repo nestledjs/nestledforms.com --merge --delete-branch`                                                                     |

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

## Source System

FlightDesk is the source of truth for task state (D23). This folder's agent never writes status,
comments or state changes to Linear; the FlightDesk turn (`flightdesk turn end`) reports the
outcome and FlightDesk advances the task. The Linear project for this repo
(`0fcd3445-0fde-4984-b54d-7dd073415905`, Nestledforms.com) is read-only context.
