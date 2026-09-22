"""Minimal HubSpot REST helper. Token comes from env HUBSPOT_TOKEN (never hardcode / commit).
Respects the agent proxy CA bundle when present. Retries 429/5xx with backoff."""
import os, time, json, requests

BASE = "https://api.hubapi.com"
TOKEN = os.environ.get("HUBSPOT_TOKEN", "").strip()
CA = os.environ.get("REQUESTS_CA_BUNDLE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else True)
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

def _req(method, path, **kw):
    if not TOKEN:
        raise SystemExit("Set HUBSPOT_TOKEN in the environment first.")
    url = path if path.startswith("http") else BASE + path
    for attempt in range(6):
        r = requests.request(method, url, headers=HEADERS, verify=CA, timeout=90, **kw)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(2 * (attempt + 1)); continue
        return r
    return r

def get(path, **kw):    return _req("GET", path, **kw)
def post(path, body, **kw):  return _req("POST", path, data=json.dumps(body), **kw)
def patch(path, body, **kw): return _req("PATCH", path, data=json.dumps(body), **kw)

def j(r):
    try: return r.json()
    except Exception: return {"_status": r.status_code, "_raw": r.text[:800]}

def ok(r): return 200 <= r.status_code < 300
