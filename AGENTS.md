# AGENTS.md — Brand Blueprint + VGP prompt directory

Read this first in any agent session (Codex, Claude Code, or other) opened on `dana774/TBB`.
All work branches were consolidated onto **`main`** on 2026-09-22; `main` is the single source of
truth. Start new work from `main`.

## Which prompt do I use?

Each prompt below is a self-contained document. When Dana names a job, open the matching file and
follow it as the operating instructions for the session.

| Job | Prompt file | Notes |
|---|---|---|
| **VGP headless website build** (Codex headless method) | [`docs/20-vgp-headless-build-prompt.md`](docs/20-vgp-headless-build-prompt.md) | Build sequence in [`docs/24-codex-build-runbook.md`](docs/24-codex-build-runbook.md); overrides in [`docs/23-v3-master-spec-reconciliation.md`](docs/23-v3-master-spec-reconciliation.md). Live app is Astro in [`vgp-headless/`](vgp-headless/). |
| VGP site deploy (Vercel) | [`docs/22-vgp-deploy-runbook.md`](docs/22-vgp-deploy-runbook.md) | Go-live steps: [`docs/25-danas-go-live-checklist.md`](docs/25-danas-go-live-checklist.md) |
| Founder Network $99 membership — Shopify setup | [`docs/24-founder-network-shopify-setup-prompt.md`](docs/24-founder-network-shopify-setup-prompt.md) | |
| Gate the member Resource Library on Shopify | [`docs/27-shopify-gating-handoff-prompt.md`](docs/27-shopify-gating-handoff-prompt.md) | |
| Populate the member hub (Google Drive) | [`docs/27-member-hub-population-prompt.md`](docs/27-member-hub-population-prompt.md) | Needs a Drive-connected agent |
| Flow tagging verification + collection build | [`docs/36-flow-tagging-verification-and-collection-prompt.md`](docs/36-flow-tagging-verification-and-collection-prompt.md) | Collections 08/09 already done (2026-08-24) |
| **The Founder Signal** — newsletter master prompt | [`docs/31-founder-signal-master-prompt.md`](docs/31-founder-signal-master-prompt.md) | Operating prompt: [`docs/30-beehiiv-newsletter-agent-prompt.md`](docs/30-beehiiv-newsletter-agent-prompt.md). Earlier spec kept at [`docs/30a-beehiiv-agent-operating-spec-2026-08-14.md`](docs/30a-beehiiv-agent-operating-spec-2026-08-14.md). |
| **Founder Funding Hot List** publisher | [`docs/32-founder-funding-hotlist-master-prompt.md`](docs/32-founder-funding-hotlist-master-prompt.md) | Write-back automation: [`docs/33-writeback-automation-runbook.md`](docs/33-writeback-automation-runbook.md) |
| Website + Shopify agents ↔ HubSpot alignment | [`docs/22-website-and-shopify-agent-handoff-prompts.md`](docs/22-website-and-shopify-agent-handoff-prompts.md) | CRM structure: [`docs/21-hubspot-crm-structure-and-integration-runbook.md`](docs/21-hubspot-crm-structure-and-integration-runbook.md) |
| HubSpot → Asana delivery handoff | [`docs/25-hubspot-asana-delivery-handoff.md`](docs/25-hubspot-asana-delivery-handoff.md) | |
| VGP Funding OS v2 (Apps Script) | [`vgp-funding-os-v2/AGENTS.md`](vgp-funding-os-v2/AGENTS.md) | |
| **Alibaba CoCreate LA follow-ups**, GillyGro sales enablement, Alibaba channel partner | [`docs/prompts/alibaba-conference-followups.md`](docs/prompts/alibaba-conference-followups.md) | Three workstreams: lead tracker + HubSpot sync, GillyGro sales scripts/commission, and Dana's own Local Channel Partner application. GillyGro client work and VGP business development are separable — do not blur them. |

## Heads-up on doc numbers

Several doc numbers are used twice (for example two `21-`, `22-`, `24-`, `26-`, `27-` files), because
separate work streams numbered docs independently before consolidation. Always go by the **full file
name** in the table above, not the number alone.

## Writing or revising a prompt

Every prompt document in this repo is held to
[`docs/prompts/_prompt-standard.md`](docs/prompts/_prompt-standard.md). That file contains a
paste-able upgrade instruction — hand it to an agent, name the document, and it will audit and
rewrite one doc at a time. The reference implementation is
[`docs/prompts/alibaba-conference-followups.md`](docs/prompts/alibaba-conference-followups.md).

The test: **a competent agent can execute the job from that file alone**, with no other context and
no access to the conversation that produced it.

Docs still carrying a "not yet brought up to the standard" banner have not been through that pass.
Executing them is fine; just expect the people table, hard facts, known caveats and tooling gotchas
to be missing or stale.

## Guardrails (apply to every prompt)

- Never publish to a live domain (`valugrowthpartners.com`, `thebrandblueprint.biz`) or send email
  without Dana's explicit approval.
- Never invent a fact. No figure, ID, URL, price or date goes into a deliverable unless it came from
  a source you can name; unknown values are labelled as placeholders **inside the document**, not
  just in chat.
- Never commit secrets (API keys, tokens). Reference secret *names* only.
- Where a prompt and a later doc disagree, the doc the prompt names as authoritative wins.
