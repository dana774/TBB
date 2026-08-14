# The Founder Signal — issue archive

Every issue of the newsletter is filed here so past issues are preserved and can be served to
paid members. This repo folder is the **system-of-record**. Full system: `docs/33`.

## Structure
```
newsletter/issues/
  catalog.json                         # master index of all issues (feeds the members archive)
  <YYYY-MM-DD-founder-signal-slug>/
    issue.pdf                          # rendered issue (print/attachment)
    issue.html                         # HTML source (from the locked template)
```

## Filing an issue (one command — do this on every send)
Render the approved issue to PDF, then run the helper — it creates the folder, copies the files, and
updates `catalog.json` for you (idempotent; safe to re-run):

```
python3 newsletter/file-issue.py \
  --pdf <issue.pdf> --html <issue.html> \
  --title "<title>" --market-signal "<this issue's signal>" \
  --date YYYY-MM-DD --status sent --beehiiv-url <url>
```

Then mirror `issue.pdf` to the Google Drive member folder (doc 33) and re-run with `--drive-file-id <id>`
to record the link. **Don't hand-edit `catalog.json`** — let the script own it so the format stays valid.

## Member access
Members reach the archive two ways (both gated to the Founder Network): the on-site
`/members/newsletter` page (renders `catalog.json` + PDFs) and the Google Drive mirror folder shared
to the `founder-network` Google Group. See `docs/33`.
