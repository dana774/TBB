# The Founder Signal — Intelligence Database

`intelligence-database.csv` is the system-of-record for the newsletter's weekly
intelligence sweep (see `docs/30-beehiiv-newsletter-agent-prompt.md`).

- **Append-only.** Each weekly run adds new rows; existing rows are never deleted or rewritten.
- **Deduped on `Source URL`.** The same link is never logged twice.
- **Written by the automated weekly Routine** (fresh session, cron). It web-sources funding
  opportunities, investor updates, and founder news for the VGP ecosystem, verifies each against
  a real source URL, and appends the results here, then pushes to this branch.
- **Member-facing back-catalog.** The gated `/members/newsletter` archive can render from this
  file; a Google Drive Sheet mirror is the member-shareable copy once the Drive connector is
  authorized for non-interactive writes.

Columns: Date logged | Category | Headline | Summary | Why it matters | Source name | Source URL |
Deadline / date | Region / sector | Used in issue
