# ⭐ WHICH BUILD IS THIS? → The Vercel-based VGP website

**Yes — this is the correct prompt/session for the Value Growth Partners website that deploys to Vercel.**

| | |
|---|---|
| **What this builds** | The **Value Growth Partners** headless marketing site (`vgp-headless/`, Astro) |
| **Hosting** | **Vercel** → live preview at **tbb-roan.vercel.app** |
| **Branch** | `claude/new-session-q4or1d` |
| **Repo** | `dana774/TBB` |
| **NOT** | Wix (retired). This site replaces the old Wix VGP site. |
| **Commerce** | The $99 Founder Network subscription is sold via **Shopify** (Brand Blueprint store) and linked from `/membership`. Shopify is a *separate* build/prompt. |
| **CRM** | HubSpot (portal 246956537) — forms capture into it live. |

**To rename this chat** so it's easy to find later: in the Claude Code web app, open this session's title (top of the conversation) and rename it to something like **"Vercel VGP site"**. That's a UI action on your side — the repo marker above is the durable record.

### The other builds (so they don't get confused)
- **Shopify / Brand Blueprint store** — a different prompt/agent. Handles the store, the $99 subscription product, episodes, theme. Give it the prompt in `docs/24`.
- This VGP site only *links out* to Shopify for checkout; it does not run the store.
