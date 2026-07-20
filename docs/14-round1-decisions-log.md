# 14 — Round 1 Decisions Log (Dana, 2026-07-20)

Records the four Round 1 editorial answers and exactly what was executed. All changes are Dana-directed (not silent corrections).

## Q1 — Historical (co-host-era) episodes → **WITHHELD**
Decision: withhold the 6 historical episodes rather than publish or edit.
Executed:
- Parked Wix `Episodes`: the 6 records set to `status = withheld-historical-review` (were "Published"), `historicalParticipantReview = true`. Records retained, nothing deleted.
- Shopify migration: these 6 pulled out of `episodes.json` into `episodes-WITHHELD.json` (publish batch is now 41, not 47). Their transcripts remain quarantined in `shopify-migration/transcripts-HISTORICAL-HOLD.json`.
- Affected slugs: capsule-3 brand-identity, Ylorie Taylor, Apple vs BlackBerry, Build a Brand panel (building-your-brand), unlocking-market-research, Build a Brand haircare panel segment.

## Q2 — Experience claim → reframed to **combined accounts, HELD pending LinkedIn figures**
Decision: replace the "$115M PepsiCo" figure with a **combined** account-management total across P&G, PepsiCo, Colgate-Palmolive and Walmart-facing roles — expected to exceed **$1B** — confirmed from Dana's LinkedIn.
Executed:
- `DanaProfile` on **both** BB (parked) and VGP updated: `pepsicoClaim` reworded to the combined-accounts framing; `pepsicoClaimStatus = PENDING — DO NOT PUBLISH` (supersedes the $115M figure).
**BLOCKER / needs Dana:** LinkedIn is authenticated and not machine-accessible to the build tools — I cannot read it or confirm the total. **Please paste the per-role account figures from your LinkedIn** (P&G, PepsiCo, Colgate-Palmolive, Walmart-facing) and I'll sum them, confirm the combined total, and update the claim to a verified, publishable statement. Until then it stays held; no billion-dollar figure is published anywhere.

## Q3 — Founder Chapter lineup → **SWAP**
Decision: feature **Best Damn Tape (Jeremy, Chao, Logan Quavo)**; move **Sruti Baz** and **Kanicka Joseph** out of the current lineup. (Dr. Michelle Cromwell stays.)
Executed:
- Parked Wix `Founders`: Sruti Baz and Kanicka Joseph set to `status = archived-from-lineup`, `hotListStatus = false`. **Records retained — not deleted.** Michelle Cromwell unchanged.
- Shopify migration `founders.json`: same two marked `NOT_FEATURED`; Michelle marked `FEATURED (pending consent + insight sign-off)`.
**BLOCKER / needs Dana:** there is **no Best Damn Tape episode or source material** anywhere in the migrated archive. Before I can build those chapters I need: (1) correct founder names/spelling and roles (three people, or "Jeremy Chao" + "Logan Quavo"?), (2) their email(s), (3) the episode or source material for the story. A ready-to-fill consent email is staged for them.
**Also still open:** the *original* Q3 question — sign-off on the "Dana's Insight" draft — now applies only to Dr. Michelle Cromwell's chapter (Sruti/Kanicka moved out). Her insight is still marked `[DRAFT — pending Dana's approval]`. Want it shown for review, approved as-is, or self-edited?

## Q4 — Consent + pull quotes → **DRAFT EMAILS**
Decision: I draft the consent-request emails for Dana to send.
Executed:
- `founder-consent-emails.md` written: a ready-to-send email for **Dr. Michelle Cromwell** (featured), a template for the **Best Damn Tape** founders (pending their details), and held notes for Sruti/Kanicka (only if reinstated).
- Consent gate unchanged: no Founder Chapter publishes until story/image/metrics consent is returned; pull quotes stay placeholder until confirmed against episode audio.

## Net state after Round 1
- Publishable episode set: **41** (6 withheld).
- Featured founder lineup: **Dr. Michelle Cromwell** now; **Best Damn Tape** pending source; Sruti Baz + Kanicka Joseph retained but not featured.
- Dana experience claim: **held**, combined-accounts framing, pending LinkedIn confirmation.
- Consent emails: drafted, awaiting Dana to send.

## Open items handed back to Dana
1. Paste LinkedIn per-role account figures (Q2).
2. Best Damn Tape founder details + source material (Q3).
3. Sign-off on Dr. Michelle Cromwell's "Dana's Insight" draft (Q3 original).
