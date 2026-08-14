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

## Filing an issue (do this on every send)
1. Render the approved issue from `newsletter/template/` to `issue.pdf` (+ keep the `issue.html`).
2. Create `newsletter/issues/<YYYY-MM-DD-founder-signal-slug>/` and drop both files in.
3. Append an entry to `catalog.json` with: date, title, market_signal, slug, pdf/html paths,
   `status: "sent"`, `sent_date`, `beehiiv_url`, and `drive_file_id` (once mirrored to Drive).
4. Mirror `issue.pdf` to the Google Drive member folder (see `docs/33`) and record its `drive_file_id`.

## Member access
Members reach the archive two ways (both gated to the Founder Network): the on-site
`/members/newsletter` page (renders `catalog.json` + PDFs) and the Google Drive mirror folder shared
to the `founder-network` Google Group. See `docs/33`.
