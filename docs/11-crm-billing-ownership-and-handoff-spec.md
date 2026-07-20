# 11 — CRM Systems of Record, Billing Ownership, and Cross-Brand Handoff Specification

## Systems of record

| System | Owns |
|---|---|
| **Shopify Customers** | Brand Blueprint members, subscribers, merchandise purchasers |
| **Appstle Memberships** | BB membership contract, tier, recurring charge, renewal, dunning/retry, protected access, cancellation |
| **Wix CRM** | VGP advisory and institutional inquiries, prospects, client relationships |
| **Wix business tools** | Existing VGP subscriptions, bespoke proposals and invoices |
| **Calendly** | Scheduling only — never master CRM, never the qualification layer |

## Existing-client protection report
- **Live VGP site untouched** this workstream: no changes to domain, plan, pages, billing, subscriptions, bookings, proposals, invoices, or protected-client access.
- Existing VGP subscription clients: remain in Wix; not recreated in Shopify; not cancelled/modified/rebilled/migrated; private scheduling routes preserved (never stored on-site — policy recorded in staging RestrictedRoutes).
- Live Brand Blueprint site untouched: domain connected, plan active, legacy pages intact, subscriber billing and protected access unchanged. Any cutover requires a separate approved DNS/redirect/analytics/rollback plan.
- New bespoke VGP engagements (advisory, institutional, speaking, accelerator, project) stay in the Wix proposal/invoice/delivery system. Converting bespoke work into a Shopify checkout requires Dana's **written** approval.
- New standardized BB memberships ($99 Founder Network and later approved tiers) originate in Shopify+Appstle **after** launch approval; none may be created in Wix after the Shopify effective-launch date. (Verified: 0 pricing plans exist on the parked BB staging site.)

## Cross-brand handoff record specification

One handoff record per person/organization crossing brands. Recommended storage: an admin-only `CrossBrandHandoffs` CMS collection on the VGP site (or an equivalent controlled sheet) — **create at first real handoff; do not pre-populate with live client data in staging.**

| Field | Type | Notes |
|---|---|---|
| `masterRelationshipId` | TEXT (UUID) | Stable ID across systems |
| `primaryEmail` | TEXT | Normalized (lowercase, trimmed) — matching key |
| `fullName` | TEXT | |
| `company` | TEXT | |
| `originBrand` | TEXT enum: `brand-blueprint` \| `vgp` | |
| `relationshipType` | TEXT enum: founder-member \| advisory-prospect \| advisory-client \| institution \| partner \| sponsor \| media \| guest | |
| `shopifyCustomerId` | TEXT (nullable) | When present |
| `wixContactId` | TEXT (nullable) | When present |
| `billingSystem` | TEXT enum: `shopify` \| `wix` \| `none` | Exactly one, never both |
| `membershipOrAdvisoryStatus` | TEXT | e.g. active-member / prospect / active-client / lapsed |
| `consentSource` | TEXT | Form/checkbox where consent was captured |
| `consentVersion` | TEXT | Policy version |
| `consentTimestamp` | DATETIME | |
| `attributionSource` | TEXT | UTM/referral at origin |
| `referral` | TEXT | Cross-brand referral context |
| `owner` | TEXT | Accountable person (default Dana Ammons) |
| `lastSync` | DATETIME | |
| `exceptionStatus` | TEXT | none \| duplicate \| conflict \| refund \| migration-candidate |

**Never synchronized or duplicated:** card data, payment tokens, bank data, private program links, client notes unrelated to the handoff, unapproved marketing consent, full form responses where only the routing outcome is needed (transfer the outcome + label, not the answers).

## Duplicate billing prevention and exception process
1. Never create the same recurring entitlement in both Wix and Shopify.
2. Never migrate an active subscription automatically — migrations are manual, approved, one at a time.
3. Match by normalized email first; on conflict (same email, different identity signals) verify identity before linking.
4. A Wix contact is not automatically a Shopify member; a Shopify member is not automatically a VGP client.
5. A cross-brand referral transfers **context and attribution only** — never payment ownership.
6. Do not attempt to transfer stored payment methods between platforms — customers re-enter payment details in the owning system.
7. **Subscription exception register** (columns: date, masterRelationshipId, systems involved, exception type duplicate/cancellation/refund/migration, resolution, approver, status). Keep alongside the handoff records; review whenever a member/client appears in both systems; every entry closes with Dana's sign-off.
