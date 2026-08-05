// HubSpot lead capture. Upserts a Contact (by email) via the CRM API using a
// HubSpot Private App token (HUBSPOT_TOKEN). No-ops gracefully when the token
// isn't set, so the site works before HubSpot is wired.
//
// Setup (Dana): HubSpot → Settings → Integrations → Private Apps → create app
// with scope `crm.objects.contacts.write`; copy the token to HUBSPOT_TOKEN.
// Optional custom contact properties for full segmentation (create in
// Settings → Properties): `vgp_pathway`, `vgp_source`, `vgp_message`.
// The code below still captures the lead even if those custom properties
// don't exist yet (it retries with standard properties only).

export type LeadFields = {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  vgp_pathway?: string;  // qualified | institutional | partner | existing_client | human_review | newsletter
  vgp_source?: string;   // which page/form
  vgp_message?: string;
};

const TOKEN = import.meta.env.HUBSPOT_TOKEN as string | undefined;
const UPSERT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';

async function post(properties: Record<string, string>) {
  return fetch(UPSERT, {
    method: 'POST',
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      inputs: [{ idProperty: 'email', id: properties.email, properties }],
    }),
  });
}

export async function upsertLead(fields: LeadFields): Promise<{ ok: boolean; skipped?: boolean; status?: number }> {
  if (!TOKEN) return { ok: false, skipped: true };
  if (!fields.email) return { ok: false, status: 400 };

  const full: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) if (v) full[k] = String(v);
  full.lifecyclestage = 'lead';

  try {
    let res = await post(full);
    if (res.status === 400) {
      // Likely an unknown custom property (vgp_*). Retry with standard props only.
      const standard: Record<string, string> = { lifecyclestage: 'lead' };
      for (const k of ['email', 'firstname', 'lastname', 'phone', 'company']) {
        if (full[k]) standard[k] = full[k];
      }
      res = await post(standard);
    }
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
